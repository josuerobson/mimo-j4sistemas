import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// GET — Fetch all prompts
export async function GET() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const prompts = await prisma.chatPrompt.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Prompts GET Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST — Create a new prompt
export async function POST(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, content, category, isActive, isDefault } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: "name e content são obrigatórios" },
        { status: 400 }
      );
    }

    const prompt = await prisma.chatPrompt.create({
      data: {
        name,
        content,
        category: category || "atendimento",
        isActive: isActive !== false,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error("Prompts POST Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT — Update a prompt
export async function PUT(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, content, category, isActive, isDefault } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id obrigatório" },
        { status: 400 }
      );
    }

    const prompt = await prisma.chatPrompt.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(isActive !== undefined && { isActive }),
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Prompts PUT Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE — Delete a prompt
export async function DELETE(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "id obrigatório" },
        { status: 400 }
      );
    }

    await prisma.chatPrompt.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Prompts DELETE Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}