import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, ArrowRight } from "lucide-react";

interface BlogPostProps {
  title: string;
  date: string;
  readTime: string;
  category: string;
  content: React.ReactNode;
  relatedPosts: { title: string; slug: string }[];
}

export default function BlogPostPage({
  title,
  date,
  readTime,
  category,
  content,
  relatedPosts,
}: BlogPostProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 animated-gradient overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full">
              {category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              {new Date(date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {readTime} de leitura
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg prose-invert prose-blue max-w-none">
            {content}
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gray-800/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Precisa de ajuda com <span className="gradient-text">seu projeto</span>?
          </h3>
          <p className="text-gray-400 mb-6">
            A J4 Sistema pode ajudar a transformar suas ideias em soluções digitais.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all"
          >
            Fale Conosco <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold mb-8">
              Artigos <span className="gradient-text">Relacionados</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all"
                >
                  <h4 className="font-semibold group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h4>
                  <span className="text-blue-400 text-sm mt-2 inline-block group-hover:translate-x-1 transition-transform">
                    Ler artigo →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}