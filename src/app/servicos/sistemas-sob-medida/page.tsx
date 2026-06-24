import type { Metadata } from "next";
import { Server } from "lucide-react";
import ServiceDetailPage from "@/components/ServiceDetailPage";

export const metadata: Metadata = {
  title: "Sistemas Sob Medida - ERP e CRM Personalizado",
  description:
    "Desenvolvimento de sistemas sob medida, ERP, CRM e software de gestão personalizado para empresas. Automação de processos e integração de sistemas.",
  keywords: [
    "sistema sob medida",
    "sistema de gestão",
    "ERP personalizado",
    "CRM personalizado",
    "software empresarial",
    "automação de processos",
    "sistema de controle",
    "sistema de estoque",
    "software para empresa",
    "desenvolvimento de sistema",
    "sistema personalizado",
  ],
  alternates: {
    canonical: "https://j4sistema.com.br/servicos/sistemas-sob-medida",
  },
};

export default function SistemasSobMedidaPage() {
  return (
    <ServiceDetailPage
      icon={Server}
      title="Sistemas Sob Medida"
      description="Desenvolvemos ERPs, CRMs e sistemas de gestão personalizados que atendem às necessidades específicas do seu negócio. Software feito sob medida para sua empresa."
      longDescription="Cada empresa tem suas particularidades e processos únicos. Sistemas genéricos raramente atendem todas as necessidades de um negócio, gerando ineficiências e retrabalho. Na J4 Sistema, desenvolvemos software sob medida que se adapta perfeitamente aos processos da sua empresa. Desde ERPs completos até sistemas específicos de controle de estoque, gestão financeira ou automação de processos internos, nossa equipe trabalha lado a lado com o cliente para entender cada detalhe da operação e entregar uma solução que realmente faz a diferença. Utilizamos tecnologias modernas e arquiteturas escaláveis para garantir que o sistema cresça junto com o seu negócio."
      features={[
        {
          title: "ERP - Gestão Empresarial",
          description:
            "Sistemas integrados de gestão que controlam financeiro, estoque, vendas, compras, produção e muito mais.",
        },
        {
          title: "CRM - Relacionamento",
          description:
            "Gestão completa do relacionamento com clientes, desde o primeiro contato até o pós-venda.",
        },
        {
          title: "Controle de Estoque",
          description:
            "Sistemas de controle de estoque com alertas, relatórios, códigos de barras e integração com fornecedores.",
        },
        {
          title: "Automação de Processos",
          description:
            "Automatização de tarefas repetitivas, fluxos de aprovação e processos internos da empresa.",
        },
        {
          title: "Integração entre Sistemas",
          description:
            "Integração de sistemas existentes com novas soluções via APIs, webhooks e sincronização de dados.",
        },
        {
          title: "Migração de Dados",
          description:
            "Migração segura de dados de sistemas legados para novas plataformas, sem perda de informações.",
        },
      ]}
      technologies={[
        "Node.js",
        "Python",
        "TypeScript",
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Redis",
        "Docker",
        "AWS",
        "React",
        "Next.js",
        "Prisma",
      ]}
      benefits={[
        "Software adaptado 100% aos seus processos",
        "Eliminação de retrabalho e ineficiências",
        "Controle total sobre sua operação",
        "Relatórios gerenciais em tempo real",
        "Redução de custos operacionais",
        "Escalabilidade para crescer com o negócio",
        "Segurança e controle de acesso por perfil",
        "Suporte e evolução contínua do sistema",
      ]}
      color="from-emerald-500 to-teal-500"
      ctaText="Solicitar Orçamento de Sistema"
    />
  );
}