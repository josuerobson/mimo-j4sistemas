import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAIResponse } from "@/lib/chat-ai";

// POST — Visitor sends a message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { visitorId, name, email, phone, message } = body;

    if (!visitorId || !message) {
      return NextResponse.json(
        { error: "visitorId e message são obrigatórios" },
        { status: 400 }
      );
    }

    // Find or create conversation
    let conversation = await prisma.chatConversation.findFirst({
      where: { visitorId, status: { not: "resolved" } },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!conversation) {
      // Create lead from visitor info
      let leadId: string | null = null;
      if (name && phone) {
        const lead = await prisma.lead.create({
          data: {
            name,
            phone,
            email: email || "",
            service: "chat-site",
            message: message.substring(0, 200),
            status: "novo",
            source: "chat",
          },
        });
        leadId = lead.id;
      }

      conversation = await prisma.chatConversation.create({
        data: {
          visitorId,
          visitorName: name || null,
          visitorEmail: email || null,
          visitorPhone: phone || null,
          leadId,
        },
        include: { messages: true },
      });
    }

    // Save visitor message
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: "visitor",
        content: message,
      },
    });

    // If waiting for human, don't run AI
    if (conversation.status === "waiting_human") {
      return NextResponse.json({
        conversationId: conversation.id,
        message: null,
        waitingHuman: true,
      });
    }

    // Build conversation history for AI
    const history = [
      ...conversation.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "visitor", content: message },
    ];

    const aiResponse = await generateAIResponse(history);

    // Save AI response
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: "ai",
        content: aiResponse.message,
      },
    });

    // If AI says handoff, mark as waiting for human
    if (aiResponse.shouldHandoff) {
      await prisma.chatConversation.update({
        where: { id: conversation.id },
        data: { status: "waiting_human" },
      });
    }

    return NextResponse.json({
      conversationId: conversation.id,
      message: aiResponse.message,
      waitingHuman: aiResponse.shouldHandoff,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET — Visitor fetches their conversation history
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const visitorId = searchParams.get("visitorId");
  const conversationId = searchParams.get("conversationId");

  if (!visitorId && !conversationId) {
    return NextResponse.json(
      { error: "visitorId ou conversationId obrigatório" },
      { status: 400 }
    );
  }

  try {
    const where = conversationId
      ? { id: conversationId }
      : visitorId
      ? { visitorId, status: { not: "resolved" } as const }
      : null;

    if (!where) {
      return NextResponse.json(
        { error: "visitorId ou conversationId obrigatório" },
        { status: 400 }
      );
    }

    const conversation = await prisma.chatConversation.findFirst({
      where,
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!conversation) {
      return NextResponse.json({ conversation: null });
    }

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        status: conversation.status,
        visitorName: conversation.visitorName,
        visitorEmail: conversation.visitorEmail,
        visitorPhone: conversation.visitorPhone,
        leadId: conversation.leadId,
        messages: conversation.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          adminName: m.adminName,
          createdAt: m.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Chat GET Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}