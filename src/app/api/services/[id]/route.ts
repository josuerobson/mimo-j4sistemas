import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getServiceById } from "@/lib/services";

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
    const service = await getServiceById(id);
    if (!service) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(service);
  } catch (error) {
    console.error("Service Detail Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
