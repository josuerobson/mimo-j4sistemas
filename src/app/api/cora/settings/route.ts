import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const settings = await prisma.coraSetting.findMany();
    const config = Object.fromEntries(
      settings.map((s: { key: string; value: string }) => [s.key, s.value])
    );
    return NextResponse.json(config);
  } catch (error) {
    console.error("Erro ao buscar configurações da Cora:", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
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

    const upserts = Object.entries(body).map(([key, value]) =>
      prisma.coraSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await prisma.$transaction(upserts);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar configurações da Cora:", error);
    return NextResponse.json(
      { error: "Erro ao salvar configurações" },
      { status: 500 }
    );
  }
}
