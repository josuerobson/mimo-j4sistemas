import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// POST — Admin resolves a conversation
export async function POST(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { conversationId } = await request.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId obrigatório" },
        { status: 400 }
      );
    }

    await prisma.chatConversation.update({
      where: { id: conversationId },
      data: { status: "resolved" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resolve Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}