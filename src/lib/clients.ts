import { prisma } from "./prisma";

export type ClientStatus = "ativo" | "inativo" | "prospecto" | "inadimplente";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  document: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  notes: string | null;
  status: ClientStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientInput {
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  document?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  notes?: string | null;
  status?: ClientStatus;
  source?: string;
}

function mapClient(c: {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  document: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  notes: string | null;
  status: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}): Client {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    company: c.company,
    document: c.document,
    address: c.address,
    city: c.city,
    state: c.state,
    zipCode: c.zipCode,
    notes: c.notes,
    status: c.status as ClientStatus,
    source: c.source,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export async function getClients(): Promise<Client[]> {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  });
  return clients.map(mapClient);
}

export async function getClientById(id: string): Promise<Client | null> {
  const client = await prisma.client.findUnique({
    where: { id },
  });
  if (!client) return null;
  return mapClient(client);
}

export async function createClient(input: ClientInput): Promise<Client> {
  const created = await prisma.client.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company ?? null,
      document: input.document ?? null,
      address: input.address ?? null,
      city: input.city ?? null,
      state: input.state ?? null,
      zipCode: input.zipCode ?? null,
      notes: input.notes ?? null,
      status: input.status ?? "ativo",
      source: input.source ?? "manual",
    },
  });
  return mapClient(created);
}

export async function updateClient(
  id: string,
  input: ClientInput
): Promise<Client | null> {
  try {
    const updated = await prisma.client.update({
      where: { id },
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company ?? null,
        document: input.document ?? null,
        address: input.address ?? null,
        city: input.city ?? null,
        state: input.state ?? null,
        zipCode: input.zipCode ?? null,
        notes: input.notes ?? null,
        status: input.status ?? "ativo",
        source: input.source ?? "manual",
      },
    });
    return mapClient(updated);
  } catch {
    return null;
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    await prisma.client.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
