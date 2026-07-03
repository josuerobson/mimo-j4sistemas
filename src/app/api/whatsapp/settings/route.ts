import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const settings = await prisma.whatsappSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((setting: { key: string; value: string }) => {
      map[setting.key] = setting.value;
    });
    return NextResponse.json(map);
  } catch (error) {
    console.error("Whatsapp Settings GET Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "key e value obrigatórios" },
        { status: 400 }
      );
    }

    await prisma.whatsappSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Whatsapp Settings PUT Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
