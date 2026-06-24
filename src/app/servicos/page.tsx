import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Smartphone,
  Server,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Serviços de Desenvolvimento de Software",
  description:
    "Conheça nossos serviços: desenvolvimento web, aplicativos mobile, sistemas sob medida e consultoria em TI. Soluções personalizadas para sua empresa.",
  keywords: [
    "serviços de desenvolvimento de software",
    "desenvolvimento web",
    "aplicativo mobile",
    "sistema sob medida",
    "consultoria TI",
    "empresa de software São Paulo",
  ],
  alternates: {
    canonical: "https://j4sistema.com.br/servicos",
  },
};

const services = [
  {
    icon: Globe,
    title: "Desenvolvimento Web",
    slug: "desenvolvimento-web",
    description:
      "Criamos sites, landing pages, sistemas web e plataformas digitais modernas, responsivas e otimizadas para SEO. Utilizamos React, Next.js, Node.js e as tecnologias mais atuais do mercado.",
    features: [
      "Sites institucionais e landing pages",
      "Sistemas web completos (ERP, CRM, PDV)",
      "E-commerce e lojas virtuais",
      "Painéis administrativos e dashboards",
      "APIs e microsserviços",
      "Progressive Web Apps (PWA)",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "Aplicativos Mobile",
    slug: "aplicativos-mobile",
    description:
      "Desenvolvemos aplicativos nativos e híbridos para iOS e Android. Do conceito ao lançamento na App Store e Google Play, com foco em performance e experiência do usuário.",
    features: [
      "Apps nativos (iOS e Android)",
      "Apps híbridos (React Native, Flutter)",
      "Integração com APIs e backends",
      "Push notifications e analytics",
      "Publicação nas lojas de apps",
      "Manutenção e atualizações",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Server,
    title: "Sistemas Sob Medida",
    slug: "sistemas-sob-medida",
    description:
      "Desenvolvemos ERPs, CRMs e sistemas de gestão personalizados para atender às necessidades específicas do seu negócio. Automação de processos que aumenta a eficiência.",
    features: [
      "ERP - Sistema de Gestão Empresarial",
      "CRM - Gestão de Relacionamento",
      "Sistema de gestão de estoque",
      "Automação de processos internos",
      "Integração entre sistemas",
      "Migração de dados e sistemas legados",
    ],
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: BarChart3,
    title: "Consultoria em TI",
    slug: "consultoria-ti",
    description:
      "Oferecemos consultoria especializada em tecnologia da informação. Análise, planejamento e implementação de soluções que impulsionam a transformação digital da sua empresa.",
    features: [
      "Auditoria e diagnóstico de TI",
      "Planejamento estratégico de tecnologia",
      "Transformação digital",
      "Migração para cloud (AWS, Azure, GCP)",
      "Segurança da informação",
      "Treinamento e capacitação de equipes",
    ],
    color: "from-orange-500 to-amber-500",
  },
];

export default function ServicosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 animated-gradient overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full mb-4">
            Nossos Serviços
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Serviços de{" "}
            <span className="gradient-text">Desenvolvimento de Software</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Oferecemos soluções completas em tecnologia para empresas de todos
            os portes. Do desenvolvimento web à consultoria em TI, transformamos
            desafios em oportunidades digitais.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
          {services.map((service, index) => (
            <div
              key={service.slug}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 !== 0 ? "lg:direction-rtl" : ""
              }`}
            >
              <div className={index % 2 !== 0 ? "lg:order-2" : ""}>
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} mb-5`}
                >
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/servicos/${service.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all"
                >
                  Saiba mais <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div
                className={`bg-gray-800/50 border border-gray-700 rounded-2xl p-8 ${
                  index % 2 !== 0 ? "lg:order-1" : ""
                }`}
              >
                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                  <service.icon className="w-32 h-32 text-gray-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 animated-gradient relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Precisa de uma{" "}
            <span className="gradient-text">solução personalizada</span>?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Entre em contato para um orçamento gratuito. Desenvolvemos a solução
            ideal para o seu negócio.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 text-lg"
          >
            Solicitar Orçamento <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}