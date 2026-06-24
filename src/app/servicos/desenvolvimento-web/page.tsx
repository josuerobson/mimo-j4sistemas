import type { Metadata } from "next";
import { Globe } from "lucide-react";
import ServiceDetailPage from "@/components/ServiceDetailPage";

export const metadata: Metadata = {
  title: "Desenvolvimento Web",
  description:
    "Serviços de desenvolvimento web profissional. Sites, sistemas web, e-commerce e aplicações modernas com React, Next.js e Node.js. Performance e SEO otimizados.",
  keywords: [
    "desenvolvimento web",
    "criação de site",
    "desenvolvimento de site",
    "sistema web",
    "e-commerce",
    "landing page",
    "site profissional",
    "desenvolvimento React",
    "Next.js",
    "Node.js",
    "programador web",
    "criar site profissional",
  ],
  alternates: {
    canonical: "https://j4sistema.com.br/servicos/desenvolvimento-web",
  },
};

export default function DesenvolvimentoWebPage() {
  return (
    <ServiceDetailPage
      icon={Globe}
      title="Desenvolvimento Web"
      description="Criamos sites, sistemas web e plataformas digitais modernas, responsivas e otimizadas para SEO. Utilizamos as tecnologias mais atuais do mercado para garantir performance, segurança e a melhor experiência para seus usuários."
      longDescription="O desenvolvimento web é o coração da presença digital de qualquer empresa. Na J4 Sistema, entendemos que um site ou sistema web bem desenvolvido é muito mais do que uma página na internet — é uma ferramenta estratégica que gera resultados. Nossa equipe domina as principais tecnologias do mercado, como React, Next.js, Node.js e TypeScript, e trabalha com metodologias ágeis para entregar projetos de alta qualidade no prazo combinado. Desde sites institucionais simples até plataformas complexas com milhares de usuários, temos a experiência e a capacidade técnica para transformar sua visão em realidade digital."
      features={[
        {
          title: "Sites Institucionais",
          description:
            "Sites profissionais que transmitem credibilidade e fortalecem a marca da sua empresa na internet.",
        },
        {
          title: "Landing Pages",
          description:
            "Páginas de conversão otimizadas para captar leads e aumentar suas vendas com taxas de conversão acima da média.",
        },
        {
          title: "E-commerce e Lojas Virtuais",
          description:
            "Lojas virtuais completas com integração de pagamento, gestão de estoque e painel administrativo.",
        },
        {
          title: "Sistemas Web Completos",
          description:
            "ERPs, CRMs, PDVs e sistemas de gestão acessíveis de qualquer lugar através do navegador.",
        },
        {
          title: "Painéis Administrativos",
          description:
            "Dashboards interativos e painéis de gestão com gráficos, relatórios e indicadores em tempo real.",
        },
        {
          title: "APIs e Microsserviços",
          description:
            "Desenvolvimento de backends robustos, APIs RESTful e arquitetura de microsserviços escalável.",
        },
      ]}
      technologies={[
        "React",
        "Next.js",
        "Node.js",
        "TypeScript",
        "Tailwind CSS",
        "PostgreSQL",
        "MongoDB",
        "Prisma",
        "Docker",
        "AWS",
        "Vercel",
        "Redis",
      ]}
      benefits={[
        "Presença digital profissional e atrativa",
        "Melhor posicionamento no Google (SEO)",
        "Carregamento rápido em todos os dispositivos",
        "Design responsivo (mobile-first)",
        "Segurança de dados dos clientes",
        "Escalabilidade para crescer com seu negócio",
        "Integração com ferramentas de marketing",
        "Painel administrativo fácil de usar",
      ]}
      color="from-blue-500 to-cyan-500"
      ctaText="Solicitar Orçamento de Site"
    />
  );
}