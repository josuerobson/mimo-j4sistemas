import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// GET — Admin fetches all conversations (active + waiting + resolved)
export async function GET() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const conversations = await prisma.chatConversation.findMany({
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 5,
        },
        _count: { select: { messages: true } },
        lead: {
          select: {
            id: true,
            name: true,
            status: true,
            phone: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(
      conversations.map((c) => ({
        id: c.id,
        visitorId: c.visitorId,
        visitorName: c.visitorName,
        visitorEmail: c.visitorEmail,
        visitorPhone: c.visitorPhone,
        leadId: c.leadId,
        lead: c.lead,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        _count: c._count,
        messages: c.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          adminName: m.adminName,
          createdAt: m.createdAt.toISOString(),
        })),
      }))
    );
  } catch (error) {
    console.error("Admin Chat GET Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
