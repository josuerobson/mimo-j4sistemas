"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/admin/DashboardShell";
import {
  Landmark,
  Save,
  CheckCircle2,
  AlertCircle,
  FileKey,
  KeyRound,
  Webhook,
  CalendarClock,
  Percent,
  Wallet,
} from "lucide-react";

interface Settings {
  cora_environment: string;
  cora_client_id: string;
  cora_certificate: string;
  cora_private_key: string;
  cora_webhook_url: string;
  cora_due_days: string;
  cora_fine_amount: string;
  cora_interest_rate: string;
  cora_discount_type: string;
  cora_discount_value: string;
  cora_payment_forms: string;
}

const defaultSettings: Settings = {
  cora_environment: "stage",
  cora_client_id: "",
  cora_certificate: "",
  cora_private_key: "",
  cora_webhook_url: "",
  cora_due_days: "3",
  cora_fine_amount: "",
  cora_interest_rate: "",
  cora_discount_type: "PERCENT",
  cora_discount_value: "",
  cora_payment_forms: "BANK_SLIP,PIX",
};

export default function CoraIntegrationPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cora/settings")
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
      const res = await fetch("/api/cora/settings", {
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

  const Textarea = ({
    label,
    icon: Icon,
    field,
    placeholder,
    hint,
    rows = 4,
  }: {
    label: string;
    icon: React.ElementType;
    field: keyof Settings;
    placeholder?: string;
    hint?: string;
    rows?: number;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-3 text-gray-500">
          <Icon className="w-4 h-4" />
        </div>
        <textarea
          value={settings[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono text-xs"
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
            <Landmark className="w-6 h-6 text-blue-500" />
            Integração Cora
          </h1>
          <p className="text-gray-400 mt-1">
            Configure as credenciais de acesso à API do banco Cora para emissão de boletos.
          </p>
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
                  value={settings.cora_environment}
                  onChange={(e) => handleChange("cora_environment", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option value="stage">Stage (sandbox)</option>
                  <option value="production">Produção</option>
                </select>
                <p className="mt-1.5 text-xs text-gray-500">
                  Em stage a URL base é https://matls-clients.api.stage.cora.com.br
                </p>
              </div>

              <Input
                label="Client ID"
                icon={KeyRound}
                field="cora_client_id"
                placeholder="seu-client-id"
                hint="Client ID fornecido pela Cora"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Textarea
                label="Certificado (.pem)"
                icon={FileKey}
                field="cora_certificate"
                placeholder="-----BEGIN CERTIFICATE-----..."
                hint="Cole o conteúdo completo do arquivo certificate.pem"
                rows={6}
              />

              <Textarea
                label="Private Key (.key)"
                icon={KeyRound}
                field="cora_private_key"
                placeholder="-----BEGIN PRIVATE KEY-----..."
                hint="Cole o conteúdo completo do arquivo private-key.key"
                rows={6}
              />
            </div>

            <Input
              label="URL do Webhook"
              icon={Webhook}
              field="cora_webhook_url"
              placeholder="https://seusite.com.br/api/webhooks/cora"
              hint="Endpoint que receberá notificações de pagamento"
            />

            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-500" />
                Configurações padrão do boleto
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Prazo de vencimento (dias)"
                  icon={CalendarClock}
                  field="cora_due_days"
                  type="number"
                  placeholder="3"
                  hint="Dias até o vencimento a partir da emissão"
                />

                <Input
                  label="Multa por atraso (centavos)"
                  icon={Wallet}
                  field="cora_fine_amount"
                  type="number"
                  placeholder="500"
                  hint="Ex: 500 para R$ 5,00"
                />

                <Input
                  label="Juros ao mês (%)"
                  icon={Percent}
                  field="cora_interest_rate"
                  type="number"
                  placeholder="3.67"
                  hint="Percentual mensal de juros"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Tipo de desconto
                  </label>
                  <select
                    value={settings.cora_discount_type}
                    onChange={(e) => handleChange("cora_discount_type", e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    <option value="PERCENT">Percentual</option>
                    <option value="FIXED">Valor fixo</option>
                  </select>
                </div>

                <Input
                  label="Valor do desconto"
                  icon={Percent}
                  field="cora_discount_value"
                  type="number"
                  placeholder="1.5"
                  hint="Percentual ou valor fixo em centavos"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Formas de pagamento
                </label>
                <input
                  type="text"
                  value={settings.cora_payment_forms}
                  onChange={(e) => handleChange("cora_payment_forms", e.target.value)}
                  placeholder="BANK_SLIP,PIX"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Use BANK_SLIP para boleto, PIX para QR Code Pix, ou BANK_SLIP,PIX para ambos.
                </p>
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
