export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  status: "novo" | "contatado" | "qualificado" | "convertido" | "perdido";
  createdAt: string;
  source: string;
}

// In-memory storage (replace with database later)
const leads: Lead[] = [
  {
    id: "1",
    name: "Carlos Oliveira",
    email: "carlos@techvendas.com.br",
    phone: "(11) 98765-4321",
    company: "TechVendas",
    service: "desenvolvimento-web",
    budget: "15k-30k",
    message: "Preciso de um e-commerce completo para minha loja de roupas.",
    status: "novo",
    createdAt: "2026-06-20T14:30:00Z",
    source: "site",
  },
  {
    id: "2",
    name: "Marina Santos",
    email: "marina@clinicasaude.com.br",
    phone: "(21) 99876-5432",
    company: "Clínica Saúde+",
    service: "aplicativo-mobile",
    budget: "30k-60k",
    message: "Queremos desenvolver um app de agendamento para nossos pacientes.",
    status: "contatado",
    createdAt: "2026-06-19T10:15:00Z",
    source: "site",
  },
  {
    id: "3",
    name: "Roberto Lima",
    email: "roberto@logexpress.com.br",
    phone: "(31) 98765-1234",
    company: "LogExpress",
    service: "sistema-sob-medida",
    budget: "60k-100k",
    message: "Precisamos de um sistema de rastreamento de encomendas.",
    status: "qualificado",
    createdAt: "2026-06-18T16:45:00Z",
    source: "site",
  },
  {
    id: "4",
    name: "Ana Paula Ferreira",
    email: "ana@modafit.com.br",
    phone: "(41) 99123-4567",
    company: "ModaFit",
    service: "desenvolvimento-web",
    budget: "5k-15k",
    message: "Preciso de um site institucional para minha marca de fitness.",
    status: "novo",
    createdAt: "2026-06-22T09:00:00Z",
    source: "site",
  },
];

export function getLeads(): Lead[] {
  return [...leads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addLead(
  lead: Omit<Lead, "id" | "status" | "createdAt" | "source">
): Lead {
  const newLead: Lead = {
    ...lead,
    id: String(leads.length + 1),
    status: "novo",
    createdAt: new Date().toISOString(),
    source: "site",
  };
  leads.push(newLead);
  return newLead;
}

export function updateLeadStatus(id: string, status: Lead["status"]): Lead | null {
  const lead = leads.find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  return lead;
}

export function deleteLead(id: string): boolean {
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return false;
  leads.splice(index, 1);
  return true;
}