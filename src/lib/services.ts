import { prisma } from "./prisma";

export type ServiceType = "hospedagem" | "vps" | "dedicado";
export type ServiceCycle = "mensal" | "bimestral" | "trimestral" | "semestral" | "anual";
export type ServiceStatus = "ativo" | "suspenso" | "cancelado";

export interface ServiceClient {
  id: string;
  name: string;
  email: string;
  company: string | null;
}

export interface Service {
  id: string;
  clientId: string;
  client: ServiceClient;
  type: ServiceType;
  amount: number;
  cycle: ServiceCycle;
  lastPaymentDate: string;
  nextRenewalDate: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceInput {
  clientId: string;
  type: ServiceType;
  amount: number;
  cycle: ServiceCycle;
  lastPaymentDate: string;
  status?: ServiceStatus;
}

const cycleMonths: Record<ServiceCycle, number> = {
  mensal: 1,
  bimestral: 2,
  trimestral: 3,
  semestral: 6,
  anual: 12,
};

export function calculateNextRenewalDate(
  lastPaymentDate: string | Date,
  cycle: ServiceCycle
): Date {
  const date = new Date(lastPaymentDate);
  const months = cycleMonths[cycle] ?? 1;
  date.setMonth(date.getMonth() + months);
  return date;
}

function mapService(service: {
  id: string;
  clientId: string;
  client: { id: string; name: string; email: string; company: string | null };
  type: string;
  amount: { toNumber(): number } | number;
  cycle: string;
  lastPaymentDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}): Service {
  const amountNumber =
    typeof service.amount === "number" ? service.amount : service.amount.toNumber();
  const nextRenewalDate = calculateNextRenewalDate(
    service.lastPaymentDate.toISOString(),
    service.cycle as ServiceCycle
  );

  return {
    id: service.id,
    clientId: service.clientId,
    client: service.client,
    type: service.type as ServiceType,
    amount: amountNumber,
    cycle: service.cycle as ServiceCycle,
    lastPaymentDate: service.lastPaymentDate.toISOString(),
    nextRenewalDate: nextRenewalDate.toISOString(),
    status: service.status as ServiceStatus,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  };
}

export async function getServices(): Promise<Service[]> {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: {
        select: { id: true, name: true, email: true, company: true },
      },
    },
  });
  return services.map(mapService);
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true },
        },
      },
    });
    if (!service) return null;
    return mapService(service);
  } catch {
    return null;
  }
}

export async function createService(input: ServiceInput): Promise<Service> {
  const created = await prisma.service.create({
    data: {
      clientId: input.clientId,
      type: input.type,
      amount: input.amount,
      cycle: input.cycle,
      lastPaymentDate: new Date(input.lastPaymentDate),
      status: input.status || "ativo",
    },
    include: {
      client: {
        select: { id: true, name: true, email: true, company: true },
      },
    },
  });
  return mapService(created);
}

export async function updateService(
  id: string,
  input: Partial<ServiceInput>
): Promise<Service | null> {
  try {
    const data: Record<string, unknown> = {};
    if (input.clientId) data.clientId = input.clientId;
    if (input.type) data.type = input.type;
    if (input.amount !== undefined) data.amount = input.amount;
    if (input.cycle) data.cycle = input.cycle;
    if (input.lastPaymentDate) data.lastPaymentDate = new Date(input.lastPaymentDate);
    if (input.status) data.status = input.status;

    const updated = await prisma.service.update({
      where: { id },
      data,
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true },
        },
      },
    });
    return mapService(updated);
  } catch {
    return null;
  }
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    await prisma.service.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export const serviceTypeLabels: Record<ServiceType, string> = {
  hospedagem: "Hospedagem de site",
  vps: "VPS",
  dedicado: "Servidor Dedicado",
};

export const serviceCycleLabels: Record<ServiceCycle, string> = {
  mensal: "Mensal",
  bimestral: "Bimestral",
  trimestral: "Trimestral",
  semestral: "Semestral",
  anual: "Anual",
};

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function isRenewalOverdue(nextRenewalDate: string | Date): boolean {
  return new Date(nextRenewalDate) < new Date();
}

export function isRenewalSoon(nextRenewalDate: string | Date, days = 7): boolean {
  const next = new Date(nextRenewalDate);
  const now = new Date();
  const diff = next.getTime() - now.getTime();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}
