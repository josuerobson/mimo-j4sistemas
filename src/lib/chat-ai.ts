// AI Chat Service — Pollinations Text API (free, no API key)

const SITE_CONTEXT = `
## Sobre a J4 Sistemas
Somos uma empresa especializada em desenvolvimento de software, aplicativos mobile e sistemas sob medida. Atendemos clientes em todo o Brasil de forma remota.

## Serviços
- **Desenvolvimento Web**: Sites institucionais, e-commerce, landing pages, sistemas web (React, Next.js, Node.js)
- **Aplicativos Mobile**: Apps nativos e híbridos para iOS e Android (React Native, Flutter)
- **Sistemas Sob Medida**: Sistemas personalizados de gestão, CRM, ERP, dashboards, automação de processos
- **Consultoria em TI**: Análise de infraestrutura, segurança, cloud computing, DevOps

## Valores de Orçamento
- R$ 5.000 - R$ 15.000 (projetos pequenos)
- R$ 15.000 - R$ 30.000 (projetos médios)
- R$ 30.000 - R$ 60.000 (projetos grandes)
- R$ 60.000 - R$ 100.000 (projetos corporativos)
- Acima de R$ 100.000 (enterprise)

## Contato
- Email: contato@j4sistema.com.br
- Telefone/WhatsApp: (41) 99744-0255
- Horário: Seg a Sex, 9h-18h | Suporte emergencial 24/7

## Perguntas Frequentes
- Prazos: site institucional (2-4 sem), sistema completo (3-6 meses)
- Suporte pós-entrega com planos de manutenção
- Processo: Análise → Design → Desenvolvimento Ágil → Testes → Entrega
- Investimento mínimo: R$ 5.000
`;

const DEFAULT_SYSTEM_PROMPT = `Você é o assistente virtual da J4 Sistemas.

Regras:
- Responda apenas sobre os serviços e informações da empresa
- Seja amigável, profissional e direto
- Use markdown simples quando apropriado
- NÃO invente informações que não estão no contexto

IMPORTANTE — Quando deve acionar um humano:
- Visitante pede para falar com alguém
- Pergunta muito específica ou técnica que você não tem certeza
- Negociação de preços especiais
- Reclamação ou problema
- Você não tem informação suficiente

Quando precisar acionar humano, comece a resposta com: [HUMAN_HANDOFF]

Contexto da empresa:
${SITE_CONTEXT}`;

export interface AIResponse {
  message: string;
  shouldHandoff: boolean;
}

export async function generateAIResponse(
  conversationHistory: { role: string; content: string }[],
  customPrompt?: string
): Promise<AIResponse> {
  const systemPrompt = customPrompt || DEFAULT_SYSTEM_PROMPT;

  try {
    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory.map((m) => ({
            role: m.role === "visitor" ? "user" : "assistant",
            content: m.content,
          })),
        ],
        seed: Math.floor(Math.random() * 999999),
        jsonMode: false,
      }),
    });

    if (!response.ok) throw new Error(`API ${response.status}`);

    const data = await response.json();
    const raw =
      data.choices?.[0]?.message?.content ||
      "Desculpe, não consegui processar. Tente novamente.";

    const shouldHandoff = raw.includes("[HUMAN_HANDOFF]");
    const clean = raw.replace(/\[HUMAN_HANDOFF\]/g, "").trim();

    return { message: clean, shouldHandoff };
  } catch (err) {
    console.error("AI Error:", err);
    return {
      message:
        "Estou com dificuldades técnicas. Vou conectar você com um especialista humano.",
      shouldHandoff: true,
    };
  }
}