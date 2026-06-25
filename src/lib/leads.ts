import { prisma } from "./prisma";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string;
  budget: string | null;
  message: string;
  status: "novo" | "contatado" | "qualificado" | "convertido" | "perdido";
  createdAt: string;
  source: string;
}

export async function getLeads(): Promise<Lead[]> {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });
  return leads.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone,
    company: l.company ?? "",
    service: l.service,
    budget: l.budget ?? "",
    message: l.message,
    status: l.status as Lead["status"],
    source: l.source,
    createdAt: l.createdAt.toISOString(),
  }));
}

export async function addLead(
  lead: Omit<Lead, "id" | "status" | "createdAt" | "source">
): Promise<Lead> {
  const created = await prisma.lead.create({
    data: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company || null,
      service: lead.service,
      budget: lead.budget || null,
      message: lead.message,
      status: "novo",
      source: "site",
    },
  });
  return {
    id: created.id,
    name: created.name,
    email: created.email,
    phone: created.phone,
    company: created.company ?? "",
    service: created.service,
    budget: created.budget ?? "",
    message: created.message,
    status: created.status as Lead["status"],
    source: created.source,
    createdAt: created.createdAt.toISOString(),
  };
}

export async function updateLeadStatus(
  id: string,
  status: Lead["status"]
): Promise<Lead | null> {
  try {
    const updated = await prisma.lead.update({
      where: { id },
      data: { status },
    });
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      company: updated.company ?? "",
      service: updated.service,
      budget: updated.budget ?? "",
      message: updated.message,
      status: updated.status as Lead["status"],
      source: updated.source,
      createdAt: updated.createdAt.toISOString(),
    };
  } catch {
    return null;
  }
}

export async function deleteLead(id: string): Promise<boolean> {
  try {
    await prisma.lead.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}