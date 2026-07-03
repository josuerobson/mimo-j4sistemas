import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  ServiceCycle,
  ServiceType,
  ServiceStatus,
} from "@/lib/services";

export async function GET() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const services = await getServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error("Services GET Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { clientId, type, amount, cycle, lastPaymentDate, status } = body;

    if (!clientId || !type || amount === undefined || !cycle || !lastPaymentDate) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    const validTypes: ServiceType[] = ["hospedagem", "vps", "dedicado"];
    const validCycles: ServiceCycle[] = [
      "mensal",
      "bimestral",
      "trimestral",
      "semestral",
      "anual",
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Tipo de serviço inválido" },
        { status: 400 }
      );
    }

    if (!validCycles.includes(cycle)) {
      return NextResponse.json(
        { error: "Ciclo de pagamento inválido" },
        { status: 400 }
      );
    }

    const service = await createService({
      clientId,
      type,
      amount: Number(amount),
      cycle,
      lastPaymentDate,
      status: (status as ServiceStatus) || "ativo",
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Services POST Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID do serviço não informado" },
        { status: 400 }
      );
    }

    const service = await updateService(id, data);
    if (!service) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Services PATCH Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID do serviço não informado" },
        { status: 400 }
      );
    }

    const success = await deleteService(id);
    if (!success) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Services DELETE Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
