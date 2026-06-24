"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Handle error silently
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 animated-gradient overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full mb-4">
            Fale Conosco
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Entre em{" "}
            <span className="gradient-text">Contato</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Estamos prontos para transformar sua ideia em realidade. Entre em
            contato para um orçamento gratuito e sem compromisso.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Informações de <span className="gradient-text">Contato</span>
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Entre em contato por qualquer um dos canais abaixo ou
                  preencha o formulário ao lado. Retornamos em até 24 horas.
                </p>
              </div>

              <div className="space-y-6">
                <a
                  href="mailto:contato@j4sistema.com.br"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Email</h3>
                    <p className="text-gray-400 text-sm group-hover:text-blue-400 transition-colors">
                      contato@j4sistema.com.br
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+5541997440255"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Telefone</h3>
                    <p className="text-gray-400 text-sm group-hover:text-emerald-400 transition-colors">
                      (41) 99744-0255
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Endereço</h3>
                    <p className="text-gray-400 text-sm">
                      São Paulo, SP - Brasil
                      <br />
                      Atendimento em todo o Brasil
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Horário de Atendimento
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Segunda a Sexta: 9h às 18h
                      <br />
                      Suporte emergencial: 24/7
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/5541997440255?text=Olá! Gostaria de solicitar um orçamento."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-emerald-600/20 border border-emerald-600/30 rounded-xl hover:bg-emerald-600/30 transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="font-semibold text-emerald-400">
                    Fale pelo WhatsApp
                  </p>
                  <p className="text-sm text-gray-400">
                    Resposta rápida garantida
                  </p>
                </div>
              </a>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-3">
                      Mensagem Enviada!
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Obrigado pelo contato. Retornaremos em até 24 horas.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          company: "",
                          service: "",
                          budget: "",
                          message: "",
                        });
                      }}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
                    >
                      Enviar outra mensagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-xl font-bold mb-2">
                      Solicite um Orçamento
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Preencha os campos abaixo e entraremos em contato.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nome *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          placeholder="(41) 99744-0255"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Empresa
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          placeholder="Nome da empresa"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Serviço Desejado *
                        </label>
                        <select
                          name="service"
                          required
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        >
                          <option value="">Selecione...</option>
                          <option value="desenvolvimento-web">
                            Desenvolvimento Web
                          </option>
                          <option value="aplicativo-mobile">
                            Aplicativo Mobile
                          </option>
                          <option value="sistema-sob-medida">
                            Sistema Sob Medida
                          </option>
                          <option value="consultoria-ti">
                            Consultoria em TI
                          </option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Orçamento Estimado
                        </label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        >
                          <option value="">Selecione...</option>
                          <option value="5k-15k">R$ 5.000 - R$ 15.000</option>
                          <option value="15k-30k">
                            R$ 15.000 - R$ 30.000
                          </option>
                          <option value="30k-60k">
                            R$ 30.000 - R$ 60.000
                          </option>
                          <option value="60k-100k">
                            R$ 60.000 - R$ 100.000
                          </option>
                          <option value="100k+">Acima de R$ 100.000</option>
                          <option value="nao-sei">
                            Não sei / Preciso de ajuda
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Descreva seu Projeto *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                        placeholder="Descreva o que você precisa, prazos, funcionalidades desejadas..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 text-lg"
                    >
                      <Send className="w-5 h-5" />
                      Enviar Mensagem
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Ao enviar, você concorda com nossa política de
                      privacidade. Seus dados não serão compartilhados com
                      terceiros.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-800/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Perguntas <span className="gradient-text">Frequentes</span>
          </h2>
          <div className="space-y-4">
            {[
              {
                question: "Quanto tempo leva para desenvolver um projeto?",
                answer:
                  "O prazo varia conforme a complexidade. Um site institucional pode levar de 2 a 4 semanas, enquanto um sistema completo pode levar de 3 a 6 meses. Após a análise inicial, fornecemos um cronograma detalhado.",
              },
              {
                question: "Vocês oferecem suporte após a entrega?",
                answer:
                  "Sim! Oferecemos planos de suporte e manutenção contínua. Todos os projetos incluem um período de garantia após a entrega para correção de eventuais problemas.",
              },
              {
                question: "Como funciona o processo de desenvolvimento?",
                answer:
                  "Nosso processo segue 4 etapas: Análise e Planejamento, Design e Prototipação, Desenvolvimento Ágil (com entregas incrementais) e Testes/Entrega. Você acompanha cada etapa de perto.",
              },
              {
                question: "Atendem empresas de outros estados?",
                answer:
                  "Sim! Atendemos clientes em todo o Brasil. Todo o processo pode ser feito remotamente, com reuniões por videoconferência e comunicação constante.",
              },
              {
                question: "Qual o investimento mínimo para um projeto?",
                answer:
                  "O investimento varia conforme o escopo do projeto. Nossos projetos começam a partir de R$ 5.000. Entre em contato para um orçamento personalizado e gratuito.",
              },
            ].map((faq) => (
              <details
                key={faq.question}
                className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden group"
              >
                <summary className="px-6 py-4 cursor-pointer font-semibold text-white hover:text-blue-400 transition-colors list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-gray-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-4 text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}