import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@j4sistema.com.br" },
    update: {},
    create: {
      email: "admin@j4sistema.com.br",
      password: "admin123",
      name: "Administrador",
      role: "admin",
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // Create sample leads
  const sampleLeads = [
    {
      name: "Carlos Oliveira",
      email: "carlos@techvendas.com.br",
      phone: "(11) 98765-4321",
      company: "TechVendas",
      service: "desenvolvimento-web",
      budget: "15k-30k",
      message:
        "Preciso de um e-commerce completo para minha loja de roupas.",
      status: "novo",
      source: "site",
    },
    {
      name: "Marina Santos",
      email: "marina@clinicasaude.com.br",
      phone: "(21) 99876-5432",
      company: "Clínica Saúde+",
      service: "aplicativo-mobile",
      budget: "30k-60k",
      message:
        "Queremos desenvolver um app de agendamento para nossos pacientes.",
      status: "contatado",
      source: "site",
    },
    {
      name: "Roberto Lima",
      email: "roberto@logexpress.com.br",
      phone: "(31) 98765-1234",
      company: "LogExpress",
      service: "sistema-sob-medida",
      budget: "60k-100k",
      message:
        "Precisamos de um sistema de rastreamento de encomendas.",
      status: "qualificado",
      source: "site",
    },
    {
      name: "Ana Paula Ferreira",
      email: "ana@modafit.com.br",
      phone: "(41) 99123-4567",
      company: "ModaFit",
      service: "desenvolvimento-web",
      budget: "5k-15k",
      message:
        "Preciso de um site institucional para minha marca de fitness.",
      status: "novo",
      source: "site",
    },
  ];

  for (const lead of sampleLeads) {
    await prisma.lead.create({ data: lead });
  }
  console.log(`✅ ${sampleLeads.length} sample leads created`);

  // Create sample clients
  const sampleClients = [
    {
      name: "Carlos Oliveira",
      email: "carlos@techvendas.com.br",
      phone: "(11) 98765-4321",
      company: "TechVendas",
      document: "12.345.678/0001-90",
      address: "Rua Augusta, 500 - Consolação",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
      notes: "Cliente prospecto para e-commerce.",
      status: "prospecto",
      source: "manual",
    },
    {
      name: "Marina Santos",
      email: "marina@clinicasaude.com.br",
      phone: "(21) 99876-5432",
      company: "Clínica Saúde+",
      document: "98.765.432/0001-10",
      address: "Av. Rio Branco, 150 - Centro",
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: "20040-000",
      notes: "App de agendamento em negociação.",
      status: "ativo",
      source: "manual",
    },
    {
      name: "Roberto Lima",
      email: "roberto@logexpress.com.br",
      phone: "(31) 98765-1234",
      company: "LogExpress",
      document: "11.222.333/0001-44",
      address: "Rua Curitiba, 800 - Savassi",
      city: "Belo Horizonte",
      state: "MG",
      zipCode: "30140-100",
      notes: "Sistema de rastreamento em desenvolvimento.",
      status: "ativo",
      source: "manual",
    },
  ];

  for (const client of sampleClients) {
    await prisma.client.create({ data: client });
  }
  console.log(`✅ ${sampleClients.length} sample clients created`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });