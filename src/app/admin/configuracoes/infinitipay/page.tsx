"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/admin/DashboardShell";
import {
  CreditCard,
  Save,
  CheckCircle2,
  AlertCircle,
  User,
  Link,
  Webhook,
} from "lucide-react";

interface Settings {
  infinitipay_handle: string;
  infinitipay_redirect_url: string;
  infinitipay_webhook_url: string;
}

export default function InfinitiPayIntegrationPage() {
  const [settings, setSettings] = useState<Settings>({
    infinitipay_handle: "",
    infinitipay_redirect_url: "",
    infinitipay_webhook_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/infinitipay/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({
          ...prev,
          infinitipay_handle: data.infinitipay_handle || "",
          infinitipay_redirect_url: data.infinitipay_redirect_url || "",
          infinitipay_webhook_url: data.infinitipay_webhook_url || "",
        }));
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
        await fetch("/api/infinitipay/settings", {
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
              <CreditCard className="w-8 h-8 text-blue-400" />
              Integração InfinitiPay
            </h1>
            <p className="text-gray-400 mt-1">
              Configure os dados da InfinitePay para geração de links de pagamento
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

        {/* Configuration */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Dados da Conta</h2>
              <p className="text-gray-400 text-sm">
                Informações obrigatórias para identificar sua conta InfinitePay
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              InfiniteTag (handle) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                @
              </span>
              <input
                type="text"
                value={settings.infinitipay_handle}
                onChange={(e) => update("infinitipay_handle", e.target.value)}
                placeholder="seu-handle"
                className="w-full pl-9 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
            <p className="text-gray-500 text-xs mt-1.5">
              Seu nome de usuário no App InfinitePay, sem o símbolo "$"
            </p>
          </div>
        </div>

        {/* Optional URLs */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Link className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">URLs Opcionais</h2>
              <p className="text-gray-400 text-sm">
                Redirecionamento e webhook para acompanhamento dos pagamentos
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL de redirecionamento
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="url"
                value={settings.infinitipay_redirect_url}
                onChange={(e) => update("infinitipay_redirect_url", e.target.value)}
                placeholder="https://seusite.com/pagamento-concluido"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
            <p className="text-gray-500 text-xs mt-1.5">
              Página que o cliente será redirecionado após o pagamento
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL do webhook
            </label>
            <div className="relative">
              <Webhook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="url"
                value={settings.infinitipay_webhook_url}
                onChange={(e) => update("infinitipay_webhook_url", e.target.value)}
                placeholder="https://seusite.com/api/infinitipay/webhook"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
            <p className="text-gray-500 text-xs mt-1.5">
              Endpoint que receberá notificações de pagamento aprovado
            </p>
          </div>
        </div>

        {/* Alert */}
        <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            <p className="font-medium text-blue-300 mb-1">Como funciona</p>
            <p>
              Após configurar sua InfiniteTag, o sistema poderá gerar links de
              pagamento para os serviços cadastrados em Cobranças recorrentes. A
              InfinitePay não exige API Key para criação de links de checkout.
            </p>
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
