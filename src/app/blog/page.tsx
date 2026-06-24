import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, Calendar, Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - Artigos sobre Desenvolvimento de Software e Tecnologia",
  description:
    "Blog da J4 Sistema. Artigos sobre desenvolvimento de software, tendências tecnológicas, dicas de programação, transformação digital e muito mais.",
  keywords: [
    "blog desenvolvimento software",
    "artigos tecnologia",
    "dicas programação",
    "tendências desenvolvimento web",
    "transformação digital",
    "blog empresa software",
  ],
  alternates: {
    canonical: "https://j4sistema.com.br/blog",
  },
};

const posts = [
  {
    title: "Como Escolher a Melhor Empresa de Desenvolvimento de Software",
    excerpt:
      "Guia completo com os principais critérios para escolher a empresa ideal para desenvolver seu projeto de software. Saiba o que avaliar antes de contratar.",
    slug: "como-escolher-empresa-desenvolvimento-software",
    date: "2026-06-15",
    readTime: "8 min",
    category: "Guia",
    featured: true,
  },
  {
    title: "Tendências de Desenvolvimento Web para 2026",
    excerpt:
      "Conheça as principais tendências tecnológicas que estão moldando o futuro do desenvolvimento web, desde IA até WebAssembly e Edge Computing.",
    slug: "tendencias-desenvolvimento-web-2026",
    date: "2026-06-10",
    readTime: "10 min",
    category: "Tendências",
    featured: true,
  },
  {
    title: "Quanto Custa Desenvolver um Aplicativo Mobile?",
    excerpt:
      "Análise completa dos fatores que influenciam o custo de desenvolvimento de aplicativos mobile. Planilha de estimativa incluída.",
    slug: "quanto-custa-desenvolver-aplicativo-mobile",
    date: "2026-06-05",
    readTime: "12 min",
    category: "Guia",
    featured: true,
  },
  {
    title: "Sistema ERP: O Que É e Por Que Sua Empresa Precisa",
    excerpt:
      "Entenda o que é um sistema ERP, como ele funciona e por que é essencial para a gestão eficiente de empresas de todos os portes.",
    slug: "sistema-erp-o-que-e-por-que-empresa-precisa",
    date: "2026-05-28",
    readTime: "7 min",
    category: "Educativo",
    featured: false,
  },
  {
    title: "React vs Next.js: Qual Escolher para Seu Projeto?",
    excerpt:
      "Comparativo detalhado entre React e Next.js. Entenda as diferenças, vantagens e quando usar cada tecnologia no seu projeto.",
    slug: "react-vs-nextjs-qual-escolher",
    date: "2026-05-20",
    readTime: "9 min",
    category: "Tecnologia",
    featured: false,
  },
  {
    title: "Transformação Digital para Pequenas Empresas",
    excerpt:
      "Como pequenas empresas podem se beneficiar da transformação digital. Guia prático com passos e exemplos reais de sucesso.",
    slug: "transformacao-digital-pequenas-empresas",
    date: "2026-05-15",
    readTime: "6 min",
    category: "Negócios",
    featured: false,
  },
  {
    title: "LGPD e Desenvolvimento de Software: O Que Você Precisa Saber",
    excerpt:
      "Tudo sobre a Lei Geral de Proteção de Dados e como ela afeta o desenvolvimento de software. Checklist de conformidade incluído.",
    slug: "lgpd-desenvolvimento-software",
    date: "2026-05-10",
    readTime: "11 min",
    category: "Legal",
    featured: false,
  },
  {
    title: "5 Benefícios de Ter um Aplicativo para Sua Empresa",
    excerpt:
      "Descubra como um aplicativo mobile pode aumentar as vendas, melhorar o atendimento e fortalecer a presença digital do seu negócio.",
    slug: "5-beneficios-aplicativo-empresa",
    date: "2026-05-05",
    readTime: "5 min",
    category: "Negócios",
    featured: false,
  },
  {
    title: "Inteligência Artificial no Desenvolvimento de Software",
    excerpt:
      "Como a inteligência artificial está revolucionando o desenvolvimento de software, desde copilots de código até testes automatizados com IA.",
    slug: "inteligencia-artificial-desenvolvimento-software",
    date: "2026-04-28",
    readTime: "8 min",
    category: "Tendências",
    featured: false,
  },
];

export default function BlogPage() {
  const featuredPosts = posts.filter((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 animated-gradient overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full mb-4">
            Blog
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Artigos sobre{" "}
            <span className="gradient-text">Tecnologia</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Conteúdo exclusivo sobre desenvolvimento de software, tendências
            tecnológicas, dicas de programação e transformação digital.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-24 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">
            Artigos em <span className="gradient-text">Destaque</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden card-hover"
              >
                <div className="h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                  <Code2 className="w-16 h-16 text-blue-400/30" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <time className="text-xs text-gray-500">
                      {new Date(post.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <span className="text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Ler mais →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* All Posts */}
          <h2 className="text-2xl font-bold mb-8">
            Todos os <span className="gradient-text">Artigos</span>
          </h2>
          <div className="space-y-4">
            {regularPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row gap-4 p-6 bg-gray-800/50 border border-gray-700 rounded-xl card-hover"
              >
                <div className="flex-shrink-0 w-full sm:w-32 h-20 sm:h-auto bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                  <Code2 className="w-8 h-8 text-blue-400/30" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded-full">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}