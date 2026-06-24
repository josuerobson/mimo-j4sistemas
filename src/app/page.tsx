import Link from "next/link";
import {
  Globe,
  Smartphone,
  Server,
  BarChart3,
  Shield,
  Zap,
  Users,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  Headphones,
  Code2,
  Database,
  Lock,
  TrendingUp,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Desenvolvimento Web",
    description:
      "Sites e sistemas web modernos, responsivos e otimizados para SEO. Utilizamos React, Next.js e as tecnologias mais atuais do mercado.",
    href: "/servicos/desenvolvimento-web",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "Aplicativos Mobile",
    description:
      "Apps nativos e híbridos para iOS e Android. Do conceito ao lançamento na App Store e Google Play.",
    href: "/servicos/aplicativos-mobile",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Server,
    title: "Sistemas Sob Medida",
    description:
      "ERPs, CRMs e sistemas de gestão personalizados para atender às necessidades específicas do seu negócio.",
    href: "/servicos/sistemas-sob-medida",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: BarChart3,
    title: "Consultoria em TI",
    description:
      "Análise, planejamento e implementação de soluções tecnológicas. Transformação digital para sua empresa.",
    href: "/servicos/consultoria-ti",
    color: "from-orange-500 to-amber-500",
  },
];

const stats = [
  { icon: Users, value: "150+", label: "Clientes Atendidos" },
  { icon: Award, value: "300+", label: "Projetos Entregues" },
  { icon: Clock, value: "10+", label: "Anos de Experiência" },
  { icon: Shield, value: "99.9%", label: "Uptime Garantido" },
];

const technologies = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Python",
  "Flutter",
  "React Native",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Tailwind CSS",
];

const benefits = [
  {
    icon: Code2,
    title: "Código Limpo e Escalável",
    description:
      "Desenvolvemos com as melhores práticas do mercado, garantindo código maintível e escalável.",
  },
  {
    icon: Zap,
    title: "Alta Performance",
    description:
      "Sistemas otimizados para carregamento rápido e melhor experiência do usuário.",
  },
  {
    icon: Lock,
    title: "Segurança Avançada",
    description:
      "Implementamos as melhores práticas de segurança para proteger seus dados e de seus clientes.",
  },
  {
    icon: Headphones,
    title: "Suporte Contínuo",
    description:
      "Oferecemos suporte técnico e manutenção contínua após a entrega do projeto.",
  },
  {
    icon: Database,
    title: "Integrações Completas",
    description:
      "Integramos seu sistema com APIs, gateways de pagamento, ERPs e outras ferramentas.",
  },
  {
    icon: TrendingUp,
    title: "SEO Otimizado",
    description:
      "Todos os projetos são desenvolvidos com foco em SEO para melhor posicionamento no Google.",
  },
];

const testimonials = [
  {
    name: "Carlos Oliveira",
    role: "CEO, TechVendas",
    content:
      "A J4 Sistema transformou completamente nossa operação. O sistema de gestão que desenvolveram aumentou nossa produtividade em 40%. Recomendo fortemente!",
    rating: 5,
  },
  {
    name: "Marina Santos",
    role: "Diretora, Clínica Saúde+",
    content:
      "O aplicativo de agendamento desenvolvido pela J4 revolucionou o atendimento dos nossos pacientes. Interface intuitiva e suporte excepcional.",
    rating: 5,
  },
  {
    name: "Roberto Lima",
    role: "Gerente, LogExpress",
    content:
      "Precisávamos de um sistema de rastreamento urgente e a J4 entregou antes do prazo. Profissionalismo e qualidade técnica impressionantes.",
    rating: 5,
  },
];

const processSteps = [
  {
    step: "01",
    title: "Análise e Planejamento",
    description:
      "Entendemos suas necessidades e definimos a melhor arquitetura e tecnologias para o projeto.",
  },
  {
    step: "02",
    title: "Design e Prototipação",
    description:
      "Criamos protótipos interativos para validação antes do desenvolvimento.",
  },
  {
    step: "03",
    title: "Desenvolvimento Ágil",
    description:
      "Desenvolvemos em sprints com entregas incrementais para seu acompanhamento.",
  },
  {
    step: "04",
    title: "Testes e Entrega",
    description:
      "Testes rigorosos de qualidade seguidos de deploy e treinamento da equipe.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center animated-gradient overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm">
                <Zap className="w-4 h-4" />
                Software Personalizado de Alto Desempenho
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Transformamos suas{" "}
                <span className="gradient-text">ideias</span> em{" "}
                <span className="gradient-text">soluções digitais</span>{" "}
                inteligentes
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                Desenvolvemos sistemas web, aplicativos mobile e software sob
                medida que automatizam processos, aumentam a produtividade e
                impulsionam o crescimento do seu negócio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 pulse-cta text-lg"
                >
                  Solicitar Orçamento Grátis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 rounded-xl transition-all text-lg"
                >
                  Ver Portfólio
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Orçamento gratuito
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Suporte 24/7
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Entrega garantida
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:block relative">
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-xs text-gray-500 font-mono">
                    j4sistema.tsx
                  </span>
                </div>
                <pre className="text-sm font-mono text-gray-300 space-y-1 overflow-hidden">
                  <code>
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-300">solucao</span> ={" "}
                    {"{\n"}
                    {"  "}
                    <span className="text-emerald-400">tecnologia</span>:{" "}
                    <span className="text-yellow-300">&quot;Next.js + TypeScript&quot;</span>,{"\n"}
                    {"  "}
                    <span className="text-emerald-400">design</span>:{" "}
                    <span className="text-yellow-300">&quot;UI/UX Moderno&quot;</span>,{"\n"}
                    {"  "}
                    <span className="text-emerald-400">performance</span>:{" "}
                    <span className="text-yellow-300">&quot;Alta Performance&quot;</span>,{"\n"}
                    {"  "}
                    <span className="text-emerald-400">seo</span>:{" "}
                    <span className="text-yellow-300">&quot;Otimizado para Google&quot;</span>,{"\n"}
                    {"  "}
                    <span className="text-emerald-400">seguranca</span>:{" "}
                    <span className="text-yellow-300">&quot;Dados Protegidos&quot;</span>,{"\n"}
                    {"  "}
                    <span className="text-emerald-400">resultado</span>:{" "}
                    <span className="text-yellow-300">
                      &quot;Negócio em Crescimento&quot;
                    </span>
                    {"\n"}
                    {"}"};
                    {"\n\n"}
                    <span className="text-purple-400">export default</span>{" "}
                    <span className="text-blue-300">sucesso</span>;
                  </code>
                </pre>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                ⚡ Entrega Ágil
              </div>
              <div className="absolute -bottom-4 -left-4 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                🎯 100% Personalizado
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800/50 border-y border-gray-700/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full mb-4">
              Nossos Serviços
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Soluções Completas em{" "}
              <span className="gradient-text">Desenvolvimento de Software</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Oferecemos serviços completos de desenvolvimento, desde a
              concepção até a entrega e manutenção do seu projeto digital.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group relative bg-gray-800/50 border border-gray-700 rounded-2xl p-8 card-hover hover:border-blue-500/50"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} mb-5`}
                >
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1 text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Saiba mais <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gray-800/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-emerald-500/10 text-emerald-400 text-sm rounded-full mb-4">
              Por que escolher a J4 Sistema?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Diferenciais que fazem a{" "}
              <span className="gradient-text">diferença</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Combinamos expertise técnica com metodologias ágeis para entregar
              soluções que realmente funcionam.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 card-hover"
              >
                <benefit.icon className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tecnologias que{" "}
              <span className="gradient-text">dominamos</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Utilizamos as tecnologias mais modernas e confiáveis do mercado
              para garantir a qualidade e performance dos nossos projetos.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:text-blue-400 hover:border-blue-500/50 transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gray-800/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-purple-500/10 text-purple-400 text-sm rounded-full mb-4">
              Nosso Processo
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Como{" "}
              <span className="gradient-text">trabalhamos</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Um processo transparente e eficiente do início ao fim.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((item) => (
              <div
                key={item.step}
                className="relative bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center card-hover"
              >
                <div className="text-5xl font-bold gradient-text mb-4 opacity-30">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-yellow-500/10 text-yellow-400 text-sm rounded-full mb-4">
              Depoimentos
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              O que nossos{" "}
              <span className="gradient-text">clientes dizem</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              A satisfação dos nossos clientes é o nosso maior indicador de
              sucesso.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 card-hover"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24 bg-gray-800/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full mb-4">
              Blog
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Últimas{" "}
              <span className="gradient-text">publicações</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Artigos e dicas sobre tecnologia, desenvolvimento e tendências do
              mercado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title:
                  "Como Escolher a Melhor Empresa de Desenvolvimento de Software",
                excerpt:
                  "Guia completo com os principais critérios para escolher a empresa ideal para desenvolver seu projeto.",
                slug: "como-escolher-empresa-desenvolvimento-software",
                date: "2026-06-15",
              },
              {
                title:
                  "Tendências de Desenvolvimento Web para 2026",
                excerpt:
                  "Conheça as principais tendências tecnológicas que estão moldando o futuro do desenvolvimento web.",
                slug: "tendencias-desenvolvimento-web-2026",
                date: "2026-06-10",
              },
              {
                title:
                  "Quanto Custa Desenvolver um Aplicativo Mobile?",
                excerpt:
                  "Análise completa dos fatores que influenciam o custo de desenvolvimento de aplicativos mobile.",
                slug: "quanto-custa-desenvolver-aplicativo-mobile",
                date: "2026-06-05",
              },
            ].map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden card-hover"
              >
                <div className="h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                  <Code2 className="w-16 h-16 text-blue-400/30" />
                </div>
                <div className="p-6">
                  <time className="text-xs text-gray-500">
                    {new Date(post.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <h3 className="text-lg font-semibold mt-2 mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-blue-400 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                    Ler artigo <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 rounded-xl transition-all"
            >
              Ver todos os artigos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 animated-gradient relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Pronto para transformar seu{" "}
            <span className="gradient-text">negócio</span>?
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar sua empresa
            a alcançar o próximo nível com soluções de software personalizadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 text-lg"
            >
              Fale Conosco Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all text-lg"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}