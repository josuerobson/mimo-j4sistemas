"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/admin/DashboardShell";
import {
  ShoppingCart,
  Save,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Webhook,
  Globe,
  Link,
} from "lucide-react";

interface Settings {
  mp_environment: string;
  mp_access_token: string;
  mp_public_key: string;
  mp_webhook_url: string;
  mp_back_url_success: string;
  mp_back_url_failure: string;
  mp_back_url_pending: string;
}

const defaultSettings: Settings = {
  mp_environment: "sandbox",
  mp_access_token: "",
  mp_public_key: "",
  mp_webhook_url: "",
  mp_back_url_success: "",
  mp_back_url_failure: "",
  mp_back_url_pending: "",
};

export default function MercadoPagoIntegrationPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/mercadopago/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.keys(defaultSettings).map((key) => [
              key,
              data[key] ?? defaultSettings[key as keyof Settings],
            ])
          ),
        }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/mercadopago/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const Input = ({
    label,
    icon: Icon,
    field,
    type = "text",
    placeholder,
    hint,
  }: {
    label: string;
    icon: React.ElementType;
    field: keyof Settings;
    type?: string;
    placeholder?: string;
    hint?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-3 text-gray-500">
          <Icon className="w-4 h-4" />
        </div>
        <input
          type={type}
          value={settings[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>
      {hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
    </div>
  );

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-blue-400" />
            Integração Mercado Pago
          </h1>
          <p className="text-gray-400 mt-1">
            Configure as credenciais de acesso à API do Mercado Pago para geração de links de pagamento.
          </p>
        </div>

        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 text-sm space-y-1">
          <p className="font-medium">Como obter as credenciais:</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-200/80">
            <li>
              Acesse{" "}
              <a
                href="https://www.mercadopago.com.br/developers/panel/app"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                mercadopago.com.br/developers/panel/app
              </a>
            </li>
            <li>Crie ou selecione um aplicativo</li>
            <li>Em &quot;Credenciais de teste&quot; copie o Access Token (TEST-...) e Public Key</li>
            <li>Para produção, use as credenciais de &quot;Credenciais de produção&quot;</li>
          </ol>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Carregando configurações...
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Ambiente
                </label>
                <select
                  value={settings.mp_environment}
                  onChange={(e) => handleChange("mp_environment", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option value="sandbox">Sandbox (testes)</option>
                  <option value="production">Produção</option>
                </select>
                <p className="mt-1.5 text-xs text-gray-500">
                  Em sandbox o link gerado usa a URL de testes do Mercado Pago
                </p>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-yellow-400" />
                Credenciais de API
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Access Token"
                  icon={KeyRound}
                  field="mp_access_token"
                  placeholder="APP_USR-... ou TEST-..."
                  hint="Token de acesso à API (começa com TEST- em sandbox)"
                />
                <Input
                  label="Public Key"
                  icon={KeyRound}
                  field="mp_public_key"
                  placeholder="APP_USR-... ou TEST-..."
                  hint="Chave pública (usada no frontend, se necessário)"
                />
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Webhook className="w-4 h-4 text-purple-400" />
                Webhook e URLs de retorno
              </h2>
              <div className="space-y-4">
                <Input
                  label="URL do Webhook"
                  icon={Webhook}
                  field="mp_webhook_url"
                  placeholder="https://seusite.com.br/api/webhooks/mercadopago"
                  hint="Endpoint que receberá notificações de pagamento do Mercado Pago"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="URL de sucesso"
                    icon={Link}
                    field="mp_back_url_success"
                    placeholder="https://seusite.com.br/obrigado"
                    hint="Redirecionado após pagamento aprovado"
                  />
                  <Input
                    label="URL de falha"
                    icon={Link}
                    field="mp_back_url_failure"
                    placeholder="https://seusite.com.br/erro"
                    hint="Redirecionado após pagamento recusado"
                  />
                  <Input
                    label="URL pendente"
                    icon={Link}
                    field="mp_back_url_pending"
                    placeholder="https://seusite.com.br/pendente"
                    hint="Redirecionado quando pagamento está pendente"
                  />
                </div>
              </div>
            </div>

            {saved && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Configurações salvas com sucesso!
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={saveSettings}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                {saving ? "Salvando..." : "Salvar configurações"}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
