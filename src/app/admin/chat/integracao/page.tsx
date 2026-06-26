"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/admin/DashboardShell";
import {
  Bot,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
} from "lucide-react";

interface Settings {
  ai_api_url: string;
  ai_api_key: string;
  ai_model: string;
  ai_temperature: string;
  ai_max_tokens: string;
  ai_top_p: string;
  ai_frequency_penalty: string;
  ai_presence_penalty: string;
  ai_system_prompt: string;
}

const AI_MODELS = [
  { group: "OpenAI", models: [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
    { value: "gpt-4", label: "GPT-4" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    { value: "o1-preview", label: "O1 Preview" },
    { value: "o1-mini", label: "O1 Mini" },
  ]},
  { group: "Anthropic (Claude)", models: [
    { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
    { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" },
    { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku" },
    { value: "claude-3-opus-20240229", label: "Claude 3 Opus" },
  ]},
  { group: "Google (Gemini)", models: [
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  ]},
  { group: "Meta (Llama)", models: [
    { value: "llama-3.1-405b", label: "Llama 3.1 405B" },
    { value: "llama-3.1-70b", label: "Llama 3.1 70B" },
    { value: "llama-3.1-8b", label: "Llama 3.1 8B" },
  ]},
  { group: "Mistral", models: [
    { value: "mistral-large-latest", label: "Mistral Large" },
    { value: "mistral-medium-latest", label: "Mistral Medium" },
    { value: "mistral-small-latest", label: "Mistral Small" },
  ]},
  { group: "DeepSeek", models: [
    { value: "deepseek-chat", label: "DeepSeek Chat" },
    { value: "deepseek-reasoner", label: "DeepSeek Reasoner" },
  ]},
  { group: "Groq", models: [
    { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (Groq)" },
    { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B (Groq)" },
  ]},
  { group: "Pollinations (Gratuito)", models: [
    { value: "openai", label: "OpenAI (Gratuito)" },
    { value: "mistral", label: "Mistral (Gratuito)" },
  ]},
];

const API_PRESETS = [
  { label: "Pollinations (Gratuito)", url: "https://text.pollinations.ai/openai", key: "" },
  { label: "OpenAI", url: "https://api.openai.com/v1/chat/completions", key: "" },
  { label: "Anthropic", url: "https://api.anthropic.com/v1/messages", key: "" },
  { label: "Google AI", url: "https://generativelanguage.googleapis.com/v1beta/chat/completions", key: "" },
  { label: "Groq", url: "https://api.groq.com/openai/v1/chat/completions", key: "" },
  { label: "OpenRouter", url: "https://openrouter.ai/api/v1/chat/completions", key: "" },
  { label: "Together AI", url: "https://api.together.xyz/v1/chat/completions", key: "" },
  { label: "Personalizado", url: "", key: "" },
];

export default function IntegracaoIAPage() {
  const [settings, setSettings] = useState<Settings>({
    ai_api_url: "",
    ai_api_key: "",
    ai_model: "openai",
    ai_temperature: "0.7",
    ai_max_tokens: "1024",
    ai_top_p: "1",
    ai_frequency_penalty: "0",
    ai_presence_penalty: "0",
    ai_system_prompt: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch("/api/chat/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const entries = Object.entries(settings).filter(([, v]) => v !== "");
      for (const [key, value] of entries) {
        await fetch("/api/chat/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Erro ao salvar configurações");
    }
    setSaving(false);
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (settings.ai_api_key) {
        headers["Authorization"] = `Bearer ${settings.ai_api_key}`;
      }
      const res = await fetch(settings.ai_api_url || "https://text.pollinations.ai/openai", {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: settings.ai_model || "openai",
          messages: [{ role: "user", content: "Responda apenas: OK" }],
          max_tokens: 10,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || "OK";
        setTestResult(`✅ Conexão OK! Resposta: "${reply}"`);
      } else {
        setTestResult(`❌ Erro HTTP ${res.status}: ${await res.text()}`);
      }
    } catch (err) {
      setTestResult(`❌ Erro de conexão: ${err}`);
    }
    setTesting(false);
  };

  const applyPreset = (preset: typeof API_PRESETS[0]) => {
    setSettings((prev) => ({
      ...prev,
      ai_api_url: preset.url,
      ai_api_key: preset.key,
    }));
  };

  const update = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-400" />
              Integração IA
            </h1>
            <p className="text-gray-400 mt-1">
              Configure a API de inteligência artificial para o chat
            </p>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-colors font-medium"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? "Salvo!" : "Salvar"}
          </button>
        </div>

        {/* Presets */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Presets Rápidos
          </h2>
          <div className="flex flex-wrap gap-2">
            {API_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.ai_api_url === preset.url
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white">Configuração da API</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL da API
            </label>
            <input
              type="url"
              value={settings.ai_api_url}
              onChange={(e) => update("ai_api_url", e.target.value)}
              placeholder="https://api.openai.com/v1/chat/completions"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Key (deixe vazio para APIs públicas)
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={settings.ai_api_key}
                onChange={(e) => update("ai_api_key", e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Modelo
            </label>
            <select
              value={settings.ai_model}
              onChange={(e) => update("ai_model", e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
            >
              {AI_MODELS.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.models.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Test Connection */}
          <div>
            <button
              onClick={testConnection}
              disabled={testing}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-gray-600 transition-colors text-sm"
            >
              {testing ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              Testar Conexão
            </button>
            {testResult && (
              <p className="mt-2 text-sm text-gray-300 bg-gray-800 rounded-lg p-3">{testResult}</p>
            )}
          </div>
        </div>

        {/* Advanced Parameters */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white">Parâmetros Avançados</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Temperatura ({settings.ai_temperature})
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.ai_temperature}
                onChange={(e) => update("ai_temperature", e.target.value)}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Preciso</span>
                <span>Criativo</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Tokens
              </label>
              <input
                type="number"
                min="100"
                max="128000"
                value={settings.ai_max_tokens}
                onChange={(e) => update("ai_max_tokens", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Top P ({settings.ai_top_p})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.ai_top_p}
                onChange={(e) => update("ai_top_p", e.target.value)}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Focado</span>
                <span>Diverso</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Frequency Penalty ({settings.ai_frequency_penalty})
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={settings.ai_frequency_penalty}
                onChange={(e) => update("ai_frequency_penalty", e.target.value)}
                className="w-full accent-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Presence Penalty ({settings.ai_presence_penalty})
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={settings.ai_presence_penalty}
                onChange={(e) => update("ai_presence_penalty", e.target.value)}
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save button bottom */}
        <div className="flex items-center gap-4">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-colors font-medium"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? "Configurações Salvas!" : "Salvar Configurações"}
          </button>
          {saved && (
            <p className="text-emerald-400 text-sm flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Salvo com sucesso
            </p>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}