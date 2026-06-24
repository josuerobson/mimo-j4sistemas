import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Smartphone,
  Server,
  BarChart3,
  ArrowRight,
  ExternalLink,
  Code2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Portfólio - Projetos de Desenvolvimento de Software",
  description:
    "Conheça os projetos desenvolvidos pela J4 Sistema. Cases de sucesso em desenvolvimento web, aplicativos mobile, sistemas sob medida e consultoria em TI.",
  keywords: [
    "portfólio desenvolvimento software",
    "cases de sucesso software",
    "projetos desenvolvimento web",
    "aplicativos desenvolvidos",
    "sistemas desenvolvidos",
    "trabalhos empresa software",
  ],
  alternates: {
    canonical: "https://j4sistema.com.br/portfolio",
  },
};

const projects = [
  {
    title: "TechVendas ERP",
    category: "Sistema Sob Medida",
    icon: Server,
    description:
      "Sistema ERP completo para empresa de distribuição com 200+ funcionários. Módulos de vendas, estoque, financeiro, compras e produção integrados.",
    technologies: ["React", "Node.js", "PostgreSQL", "Docker"],
    results: [
      "40% aumento na produtividade",
      "Redução de 60% em erros operacionais",
      "ROI em 8 meses",
    ],
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Clínica Saúde+ App",
    category: "Aplicativo Mobile",
    icon: Smartphone,
    description:
      "Aplicativo de agendamento médico com telemedicina, prontuário eletrônico e gestão de pacientes para rede de clínicas com 15 unidades.",
    technologies: ["React Native", "Firebase", "Node.js", "MongoDB"],
    results: [
      "300% aumento em agendamentos online",
      "95% satisfação dos pacientes",
      "Redução de 50% em faltas",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "LogExpress Tracking",
    category: "Desenvolvimento Web",
    icon: Globe,
    description:
      "Plataforma de rastreamento em tempo real para empresa de logística com frota de 500+ veículos. Dashboard executivo e alertas automáticos.",
    technologies: ["Next.js", "TypeScript", "AWS", "Redis"],
    results: [
      "Rastreamento em tempo real",
      "Redução de 30% no tempo de entrega",
      "Economia de R$ 200k/ano em combustível",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "EcoShop E-commerce",
    category: "Desenvolvimento Web",
    icon: Globe,
    description:
      "Loja virtual completa para marca de produtos sustentáveis com integração de marketplaces, gestão de estoque e programa de fidelidade.",
    technologies: ["Next.js", "Stripe", "PostgreSQL", "Vercel"],
    results: [
      "Faturamento 3x maior em 6 meses",
      "Conversão de 4.2%",
      "10.000+ pedidos/mês",
    ],
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "AutoParts CRM",
    category: "Sistema Sob Medida",
    icon: Server,
    description:
      "CRM personalizado para rede de autopeças com gestão de clientes, pipeline de vendas, controle de comissões e relatórios gerenciais.",
    technologies: ["React", "Python", "PostgreSQL", "Docker"],
    results: [
      "Vendas aumentaram 25%",
      "Pipeline 100% organizado",
      "Relatórios em tempo real",
    ],
    color: "from-orange-500 to-red-500",
  },
  {
    title: "FinControl Dashboard",
    category: "Consultoria em TI",
    icon: BarChart3,
    description:
      "Consultoria e implementação de BI para empresa financeira. Dashboard com KPIs, relatórios automatizados e análise preditiva.",
    technologies: ["Power BI", "Python", "Azure", "SQL Server"],
    results: [
      "Decisões baseadas em dados",
      "Relatórios automáticos diários",
      "Previsão de receita com 92% precisão",
    ],
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "FoodieDelivery App",
    category: "Aplicativo Mobile",
    icon: Smartphone,
    description:
      "Aplicativo de delivery para rede de restaurantes com cardápio digital, pagamento integrado, rastreamento de pedido e programa de fidelidade.",
    technologies: ["Flutter", "Firebase", "Node.js", "Stripe"],
    results: [
      "5000+ pedidos no primeiro mês",
      "Avaliação 4.8 nas lojas de apps",
      "Ticket médio 35% maior",
    ],
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "EduPlatform LMS",
    category: "Desenvolvimento Web",
    icon: Globe,
    description:
      "Plataforma de ensino a distância com videoaulas, exercícios interativos, certificação e gestão de alunos para escola de tecnologia.",
    technologies: ["Next.js", "AWS", "PostgreSQL", "Stripe"],
    results: [
      "5000+ alunos ativos",
      "Taxa de conclusão de 78%",
      "Receita recorrente de R$ 150k/mês",
    ],
    color: "from-violet-500 to-purple-500",
  },
];

export default function PortfolioPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 animated-gradient overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full mb-4">
            Nosso Portfólio
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Cases de{" "}
            <span className="gradient-text">Sucesso</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Conheça alguns dos projetos que desenvolvemos e os resultados
            alcançados. Cada projeto é uma história de transformação digital.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.title}
                className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden card-hover"
              >
                {/* Header */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${project.color}`}
                    >
                      <project.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs px-3 py-1 bg-gray-700 text-gray-300 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-3 py-1 bg-gray-700/50 text-gray-400 rounded-full border border-gray-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Results */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-emerald-400 mb-3">
                      Resultados:
                    </h4>
                    {project.results.map((result) => (
                      <div
                        key={result}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-800/50 border-y border-gray-700/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                300+
              </div>
              <div className="text-gray-400 text-sm">Projetos Entregues</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                150+
              </div>
              <div className="text-gray-400 text-sm">Clientes Satisfeitos</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                99.9%
              </div>
              <div className="text-gray-400 text-sm">Uptime Médio</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                4.9
              </div>
              <div className="text-gray-400 text-sm">Avaliação Média</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 animated-gradient relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Quer ser nosso próximo{" "}
            <span className="gradient-text">case de sucesso</span>?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Entre em contato e conte-nos sobre o seu projeto. Vamos transformar
            sua ideia em realidade.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 text-lg"
          >
            Iniciar Meu Projeto <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}