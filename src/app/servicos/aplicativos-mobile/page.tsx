import type { Metadata } from "next";
import { Smartphone } from "lucide-react";
import ServiceDetailPage from "@/components/ServiceDetailPage";

export const metadata: Metadata = {
  title: "Desenvolvimento de Aplicativos Mobile",
  description:
    "Desenvolvimento de aplicativos mobile nativos e híbridos para iOS e Android. Apps com React Native, Flutter e tecnologias modernas. Do conceito ao lançamento nas lojas.",
  keywords: [
    "desenvolvimento de aplicativo",
    "criar aplicativo",
    "app mobile",
    "aplicativo iOS",
    "aplicativo Android",
    "React Native",
    "Flutter",
    "desenvolvimento mobile",
    "criar app",
    "aplicativo para empresa",
    "app delivery",
    "programador mobile",
  ],
  alternates: {
    canonical: "https://j4sistema.com.br/servicos/aplicativos-mobile",
  },
};

export default function AplicativosMobilePage() {
  return (
    <ServiceDetailPage
      icon={Smartphone}
      title="Desenvolvimento de Aplicativos Mobile"
      description="Desenvolvemos aplicativos nativos e híbridos para iOS e Android com foco em performance, experiência do usuário e resultados. Do conceito ao lançamento na App Store e Google Play."
      longDescription="Os aplicativos mobile se tornaram essenciais para empresas que desejam se conectar diretamente com seus clientes e otimizar processos internos. Na J4 Sistema, desenvolvemos apps que vão além do básico — criamos experiências digitais que engajam usuários e geram resultados concretos. Utilizamos tecnologias como React Native e Flutter para desenvolver aplicativos multiplataforma com performance nativa, reduzindo custos e tempo de desenvolvimento. Nossa equipe cuida de todas as etapas: concepção, design UI/UX, desenvolvimento, testes, publicação nas lojas e manutenção contínua."
      features={[
        {
          title: "Apps Nativos iOS e Android",
          description:
            "Aplicativos desenvolvidos especificamente para cada plataforma, garantindo máxima performance e integração.",
        },
        {
          title: "Apps Híbridos Multiplataforma",
          description:
            "Desenvolvimento com React Native ou Flutter para iOS e Android com um único código base, reduzindo custos.",
        },
        {
          title: "Integração com Backends",
          description:
            "Integração completa com APIs, sistemas existentes, gateways de pagamento e serviços em nuvem.",
        },
        {
          title: "Push Notifications",
          description:
            "Sistema de notificações push para engajamento de usuários e comunicação em tempo real.",
        },
        {
          title: "Publicação nas Lojas",
          description:
            "Cuidamos de todo o processo de publicação na App Store e Google Play, incluindo otimização (ASO).",
        },
        {
          title: "Analytics e Monitoramento",
          description:
            "Integração com ferramentas de analytics para acompanhar o comportamento dos usuários e métricas.",
        },
      ]}
      technologies={[
        "React Native",
        "Flutter",
        "Swift",
        "Kotlin",
        "Firebase",
        "Node.js",
        "TypeScript",
        "GraphQL",
        "AWS Amplify",
        "Expo",
        "Redux",
        "Jest",
      ]}
      benefits={[
        "Alcance direto dos clientes no celular",
        "Aumento do engajamento e retenção",
        "Canal de vendas direto e eficiente",
        "Melhoria na experiência do cliente",
        "Automação de processos internos",
        "Notificações promocionais em tempo real",
        "Funcionamento offline para alguns recursos",
        "Integração com câmera, GPS e sensores",
      ]}
      color="from-purple-500 to-pink-500"
      ctaText="Solicitar Orçamento de App"
    />
  );
}