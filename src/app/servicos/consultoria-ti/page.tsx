import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import ServiceDetailPage from "@/components/ServiceDetailPage";

export const metadata: Metadata = {
  title: "Consultoria em TI e Transformação Digital",
  description:
    "Consultoria especializada em TI. Transformação digital, segurança da informação, migração para cloud e planejamento estratégico de tecnologia para empresas.",
  keywords: [
    "consultoria TI",
    "consultoria em tecnologia",
    "transformação digital",
    "segurança da informação",
    "migração cloud",
    "planejamento estratégico TI",
    "infraestrutura de TI",
    "consultor de TI",
    "empresa de consultoria",
    "gestão de TI",
    "terceirização de TI",
  ],
  alternates: {
    canonical: "https://j4sistema.com.br/servicos/consultoria-ti",
  },
};

export default function ConsultoriaTIPage() {
  return (
    <ServiceDetailPage
      icon={BarChart3}
      title="Consultoria em TI"
      description="Oferecemos consultoria especializada em tecnologia da informação para empresas que desejam otimizar seus processos, reduzir custos e se preparar para o futuro digital."
      longDescription="A tecnologia é um dos maiores aliados do crescimento empresarial, mas muitas empresas ainda não aproveitam todo o seu potencial. Nossa consultoria em TI ajuda empresas de todos os portes a entenderem suas necessidades tecnológicas, identificarem oportunidades de melhoria e implementarem soluções que geram resultados reais. Desde a auditoria da infraestrutura existente até a implementação completa de transformação digital, nossa equipe de especialistas trabalha para que a tecnologia seja um diferencial competitivo para o seu negócio. Oferecemos diagnóstico completo, planejamento estratégico, implementação de soluções e acompanhamento contínuo."
      features={[
        {
          title: "Auditoria e Diagnóstico de TI",
          description:
            "Análise completa da infraestrutura, processos e sistemas atuais para identificar melhorias e vulnerabilidades.",
        },
        {
          title: "Planejamento Estratégico",
          description:
            "Elaboração de roadmap tecnológico alinhado aos objetivos estratégicos do negócio.",
        },
        {
          title: "Transformação Digital",
          description:
            "Implementação de soluções digitais que modernizam processos e aumentam a competitividade.",
        },
        {
          title: "Migração para Cloud",
          description:
            "Migração segura de infraestrutura e sistemas para nuvem (AWS, Azure, GCP) com redução de custos.",
        },
        {
          title: "Segurança da Informação",
          description:
            "Implementação de políticas de segurança, LGPD, proteção contra ataques e backup de dados.",
        },
        {
          title: "Treinamento de Equipes",
          description:
            "Capacitação de equipes em novas tecnologias, ferramentas e melhores práticas de TI.",
        },
      ]}
      technologies={[
        "AWS",
        "Azure",
        "Google Cloud",
        "Docker",
        "Kubernetes",
        "Terraform",
        "Linux",
        "Nginx",
        "CI/CD",
        "Grafana",
        "Prometheus",
        "Zabbix",
      ]}
      benefits={[
        "Redução de custos com infraestrutura",
        "Maior segurança e proteção de dados",
        "Processos mais eficientes e automatizados",
        "Melhor experiência para colaboradores",
        "Conformidade com LGPD e regulamentações",
        "Escalabilidade e flexibilidade operacional",
        "Suporte técnico especializado contínuo",
        "Vantagem competitiva no mercado",
      ]}
      color="from-orange-500 to-amber-500"
      ctaText="Solicitar Consultoria"
    />
  );
}