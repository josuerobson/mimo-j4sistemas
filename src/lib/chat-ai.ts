// AI Chat Service — Supports configurable API (OpenAI, Anthropic, Google, etc.)

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

export interface AIConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  systemPrompt: string;
}

export interface AIResponse {
  message: string;
  shouldHandoff: boolean;
}

const DEFAULT_CONFIG: AIConfig = {
  apiUrl: "https://text.pollinations.ai/openai",
  apiKey: "",
  model: "openai",
  temperature: 0.7,
  maxTokens: 1024,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  systemPrompt: `Você é o assistente virtual da J4 Sistemas.

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
${SITE_CONTEXT}`,
};

export async function loadAIConfig(): Promise<AIConfig> {
  try {
    const { prisma } = await import("./prisma");
    
    const settings = await prisma.chatSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s: { key: string; value: string }) => (map[s.key] = s.value));

    // Load active prompts and append to system prompt
    const activePrompts = await prisma.chatPrompt.findMany({
      where: { isActive: true },
      orderBy: { isDefault: "desc" },
    });

    let extraPrompts = "";
    if (activePrompts.length > 0) {
      extraPrompts = "\n\n## Instruções adicionais do administrador:\n" +
        activePrompts.map((p: { name: string; content: string }) => `### ${p.name}\n${p.content}`).join("\n\n");
    }

    const config: AIConfig = {
      apiUrl: map["ai_api_url"] || DEFAULT_CONFIG.apiUrl,
      apiKey: map["ai_api_key"] || DEFAULT_CONFIG.apiKey,
      model: map["ai_model"] || DEFAULT_CONFIG.model,
      temperature: parseFloat(map["ai_temperature"] || String(DEFAULT_CONFIG.temperature)),
      maxTokens: parseInt(map["ai_max_tokens"] || String(DEFAULT_CONFIG.maxTokens), 10),
      topP: parseFloat(map["ai_top_p"] || String(DEFAULT_CONFIG.topP)),
      frequencyPenalty: parseFloat(map["ai_frequency_penalty"] || String(DEFAULT_CONFIG.frequencyPenalty)),
      presencePenalty: parseFloat(map["ai_presence_penalty"] || String(DEFAULT_CONFIG.presencePenalty)),
      systemPrompt: (map["ai_system_prompt"] || DEFAULT_CONFIG.systemPrompt) + extraPrompts,
    };

    return config;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function generateAIResponse(
  conversationHistory: { role: string; content: string }[],
  configOverride?: Partial<AIConfig>
): Promise<AIResponse> {
  const config = { ...(await loadAIConfig()), ...configOverride };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (config.apiKey) {
      headers["Authorization"] = `Bearer ${config.apiKey}`;
    }

    const response = await fetch(config.apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: config.systemPrompt },
          ...conversationHistory.map((m) => ({
            role: m.role === "visitor" ? "user" : "assistant",
            content: m.content,
          })),
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
        frequency_penalty: config.frequencyPenalty,
        presence_penalty: config.presencePenalty,
        seed: Math.floor(Math.random() * 999999),
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