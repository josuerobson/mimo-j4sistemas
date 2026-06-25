import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// POST — Admin sends a human reply
export async function POST(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { conversationId, message } = await request.json();

    if (!conversationId || !message) {
      return NextResponse.json(
        { error: "conversationId e message obrigatórios" },
        { status: 400 }
      );
    }

    const conversation = await prisma.chatConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversa não encontrada" },
        { status: 404 }
      );
    }

    // Save human reply
    await prisma.chatMessage.create({
      data: {
        conversationId,
        role: "human",
        content: message,
        adminName: user.name,
      },
    });

    // Update conversation status to active (admin is handling)
    await prisma.chatConversation.update({
      where: { id: conversationId },
      data: { status: "active" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reply Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}