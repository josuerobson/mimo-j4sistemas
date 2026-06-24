import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  Code2,
  Lightbulb,
  Shield,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre a J4 Sistema",
  description:
    "Conheça a J4 Sistema, empresa de desenvolvimento de software personalizado com mais de 10 anos de experiência. Nossa missão é transformar negócios através da tecnologia.",
  keywords: [
    "sobre j4 sistema",
    "empresa de software",
    "desenvolvimento de software personalizado",
    "empresa de tecnologia São Paulo",
    "equipe de desenvolvimento",
  ],
  alternates: {
    canonical: "https://j4sistema.com.br/sobre",
  },
};

const values = [
  {
    icon: Target,
    title: "Foco no Cliente",
    description:
      "Cada projeto é único. Entendemos profundamente as necessidades do cliente para entregar soluções que realmente fazem diferença.",
  },
  {
    icon: Lightbulb,
    title: "Inovação Constante",
    description:
      "Estamos sempre atualizados com as últimas tendências e tecnologias do mercado para oferecer soluções de ponta.",
  },
  {
    icon: Shield,
    title: "Qualidade e Segurança",
    description:
      "Seguimos os mais altos padrões de qualidade e segurança em todos os projetos que desenvolvemos.",
  },
  {
    icon: Heart,
    title: "Transparência",
    description:
      "Comunicação clara e transparente em todas as etapas do projeto, do planejamento à entrega.",
  },
  {
    icon: TrendingUp,
    title: "Resultados Reais",
    description:
      "Nosso sucesso é medido pelo sucesso dos nossos clientes. Focamos em entregar resultados mensuráveis.",
  },
  {
    icon: Users,
    title: "Trabalho em Equipe",
    description:
      "Acreditamos que as melhores soluções surgem da colaboração entre profissionais talentosos e dedicados.",
  },
];

const timeline = [
  {
    year: "2015",
    title: "Fundação",
    description:
      "A J4 Sistema foi fundada com a missão de democratizar o acesso a soluções de software de qualidade para empresas de todos os portes.",
  },
  {
    year: "2017",
    title: "Expansão de Serviços",
    description:
      "Ampliamos nosso portfólio para incluir desenvolvimento mobile e consultoria em TI, atendendo demandas crescentes do mercado.",
  },
  {
    year: "2019",
    title: "Marco de 100 Projetos",
    description:
      "Alcançamos a marca de 100 projetos entregues com sucesso, consolidando nossa reputação no mercado.",
  },
  {
    year: "2021",
    title: "Transformação Digital",
    description:
      "Nos tornamos referência em transformação digital, ajudando dezenas de empresas a modernizar seus processos.",
  },
  {
    year: "2023",
    title: "Expansão Nacional",
    description:
      "Expandimos nossa atendimento para todo o Brasil, atendendo clientes em mais de 15 estados.",
  },
  {
    year: "2026",
    title: "Liderança em Inovação",
    description:
      "Hoje somos reconhecidos como líderes em inovação, com mais de 300 projetos e 150 clientes satisfeitos.",
  },
];

const team = [
  {
    name: "João Silva",
    role: "CEO & Fundador",
    description:
      "Mais de 15 anos de experiência em tecnologia. Visionário e apaixonado por inovação.",
  },
  {
    name: "Maria Santos",
    role: "CTO",
    description:
      "Especialista em arquitetura de software e cloud computing. Líder técnica da equipe.",
  },
  {
    name: "Pedro Costa",
    role: "Lead Developer",
    description:
      "Full-stack developer com expertise em React, Node.js e Python. Referência em código limpo.",
  },
  {
    name: "Ana Oliveira",
    role: "UX/UI Designer",
    description:
      "Designer premiada com foco em experiência do usuário e interfaces intuitivas.",
  },
];

export default function SobrePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 animated-gradient overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full mb-4">
            Sobre Nós
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Conheça a{" "}
            <span className="gradient-text">J4 Sistema</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Somos uma empresa de desenvolvimento de software personalizado
            comprometida em transformar negócios através da tecnologia. Com mais
            de 10 anos de experiência, entregamos soluções inovadoras que geram
            resultados reais.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
              <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Missão</h3>
              <p className="text-gray-400 leading-relaxed">
                Desenvolver soluções de software inovadoras e de alta qualidade
                que transformem a gestão dos negócios de nossos clientes,
                impulsionando seu crescimento e eficiência.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
              <Eye className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Visão</h3>
              <p className="text-gray-400 leading-relaxed">
                Ser reconhecida como a empresa de desenvolvimento de software
                mais inovadora e confiável do Brasil, referência em qualidade,
                tecnologia e atendimento ao cliente.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Valores</h3>
              <p className="text-gray-400 leading-relaxed">
                Inovação, qualidade, transparência, compromisso com o cliente,
                trabalho em equipe e responsabilidade social são os pilares que
                guiam todas as nossas ações.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: "150+", label: "Clientes Satisfeitos" },
              { icon: Award, value: "300+", label: "Projetos Entregues" },
              { icon: Clock, value: "10+", label: "Anos de Mercado" },
              { icon: Code2, value: "50+", label: "Tecnologias Dominadas" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6">
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 bg-gray-800/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Nossos{" "}
              <span className="gradient-text">Diferenciais</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              O que nos torna únicos no mercado de desenvolvimento de software.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 card-hover"
              >
                <value.icon className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Nossa{" "}
              <span className="gradient-text">História</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Uma jornada de crescimento, inovação e conquistas.
            </p>
          </div>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div
                key={item.year}
                className={`flex gap-6 items-start ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {item.year}
                  </span>
                </div>
                <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gray-800/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Nossa{" "}
              <span className="gradient-text">Equipe</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Profissionais talentosos e apaixonados por tecnologia.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center card-hover"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-blue-400 text-sm mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 animated-gradient relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Quer fazer parte da nossa{" "}
            <span className="gradient-text">história</span>?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Entre em contato e descubra como podemos ajudar sua empresa a
            alcançar novos patamares com tecnologia.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 text-lg"
          >
            Fale Conosco <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}