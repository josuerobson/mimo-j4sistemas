import Link from "next/link";
import { ArrowRight, CheckCircle2, type LucideIcon } from "lucide-react";

interface ServicePageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  longDescription: string;
  features: { title: string; description: string }[];
  technologies: string[];
  benefits: string[];
  color: string;
  ctaText: string;
}

export default function ServiceDetailPage({
  icon: Icon,
  title,
  description,
  longDescription,
  features,
  technologies,
  benefits,
  color,
  ctaText,
}: ServicePageProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 animated-gradient overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} mb-5`}
              >
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">{title}</h1>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                {description}
              </p>
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 text-lg"
              >
                {ctaText} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="hidden lg:block bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                <Icon className="w-40 h-40 text-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-24 bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">
            Sobre este <span className="gradient-text">serviço</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            {longDescription}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-800/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            O que <span className="gradient-text">oferecemos</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 card-hover"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Tecnologias <span className="gradient-text">utilizadas</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:text-blue-400 hover:border-blue-500/50 transition-all"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-gray-800/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="gradient-text">Benefícios</span> para seu negócio
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-xl"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300">{benefit}</span>
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
            Pronto para <span className="gradient-text">começar</span>?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Entre em contato para um orçamento gratuito e sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 text-lg"
            >
              Solicitar Orçamento <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all text-lg"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}