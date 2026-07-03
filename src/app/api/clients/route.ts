import { NextResponse } from "next/server";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  ClientInput,
  ClientStatus,
} from "@/lib/clients";
import { verifyAuth } from "@/lib/auth";

const validStatuses: ClientStatus[] = [
  "ativo",
  "inativo",
  "prospecto",
  "inadimplente",
];

export async function GET() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const clients = await getClients();
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, company, document, address, neighborhood, number, complement, city, state, zipCode, notes, status } =
      body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Nome, email e telefone são obrigatórios" },
        { status: 400 }
      );
    }

    const input: ClientInput = {
      name,
      email,
      phone,
      company,
      document,
      address,
      neighborhood,
      number,
      complement,
      city,
      state,
      zipCode,
      notes,
      status: validStatuses.includes(status) ? status : "ativo",
      source: "manual",
    };

    const client = await createClient(input);
    return NextResponse.json(client, { status: 201 });
  } catch {
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
    const { id, name, email, phone, company, document, address, neighborhood, number, complement, city, state, zipCode, notes, status } =
      body;

    if (!id) {
      return NextResponse.json(
        { error: "ID do cliente é obrigatório" },
        { status: 400 }
      );
    }

    const input: ClientInput = {
      name,
      email,
      phone,
      company,
      document,
      address,
      neighborhood,
      number,
      complement,
      city,
      state,
      zipCode,
      notes,
      status: validStatuses.includes(status) ? status : "ativo",
    };

    const client = await updateClient(id, input);
    if (!client) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(client);
  } catch {
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
    const success = await deleteClient(id);
    if (!success) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
