import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        conversations: {
          include: {
            messages: { orderBy: { createdAt: "asc" } },
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      service: lead.service,
      budget: lead.budget,
      message: lead.message,
      status: lead.status,
      source: lead.source,
      createdAt: lead.createdAt.toISOString(),
      conversations: lead.conversations.map((c) => ({
        id: c.id,
        status: c.status,
        visitorName: c.visitorName,
        visitorPhone: c.visitorPhone,
        createdAt: c.createdAt.toISOString(),
        messages: c.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          adminName: m.adminName,
          createdAt: m.createdAt.toISOString(),
        })),
      })),
    });
  } catch (error) {
    console.error("Lead Detail Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}