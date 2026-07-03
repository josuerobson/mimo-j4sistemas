"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/admin/DashboardShell";
import {
  MessageCircle,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Server,
  Key,
  Link,
} from "lucide-react";

interface Settings {
  evolution_url: string;
  evolution_api_key: string;
}

const tabs = [
  { id: "evolution", label: "Evolution API" },
];

export default function WhatsappIntegrationPage() {
  const [settings, setSettings] = useState<Settings>({
    evolution_url: "",
    evolution_api_key: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState("evolution");

  useEffect(() => {
    fetch("/api/whatsapp/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({
          ...prev,
          evolution_url: data.evolution_url || "",
          evolution_api_key: data.evolution_api_key || "",
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
        await fetch("/api/whatsapp/settings", {
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
              <MessageCircle className="w-8 h-8 text-green-400" />
              Integração Whatsapp
            </h1>
            <p className="text-gray-400 mt-1">
              Configure a integração com a Evolution API para envio de mensagens
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

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Evolution API Tab */}
        {activeTab === "evolution" && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Evolution API</h2>
                <p className="text-gray-400 text-sm">
                  Dados de conexão com a instância da Evolution API
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL da Evolution
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="url"
                  value={settings.evolution_url}
                  onChange={(e) => update("evolution_url", e.target.value)}
                  placeholder="https://evolution-api.seudominio.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1.5">
                Endereço base da sua instância da Evolution API
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showKey ? "text" : "password"}
                  value={settings.evolution_api_key}
                  onChange={(e) => update("evolution_api_key", e.target.value)}
                  placeholder="Sua chave de API da Evolution"
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-1.5">
                Chave de autenticação disponível no painel da Evolution API
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-medium text-blue-300 mb-1">Atenção</p>
                <p>
                  Mantenha a API Key em segurança. Ela será usada para comunicação
                  com a Evolution API e não deve ser compartilhada.
                </p>
              </div>
            </div>
          </div>
        )}

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
