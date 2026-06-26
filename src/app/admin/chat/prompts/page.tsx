"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/admin/DashboardShell";
import {
  FileText,
  Plus,
  Save,
  Trash2,
  X,
  CheckCircle2,
  Circle,
  ToggleLeft,
  ToggleRight,
  Star,
  Edit3,
} from "lucide-react";

interface ChatPrompt {
  id: string;
  name: string;
  content: string;
  category: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  { value: "atendimento", label: "Atendimento" },
  { value: "vendas", label: "Vendas" },
  { value: "suporte", label: "Suporte Técnico" },
  { value: "faq", label: "FAQ" },
  { value: "personalizado", label: "Personalizado" },
];

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<ChatPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ChatPrompt | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    content: "",
    category: "atendimento",
    isActive: true,
    isDefault: false,
  });
  const [saving, setSaving] = useState(false);

  const fetchPrompts = () => {
    setLoading(true);
    fetch("/api/chat/prompts")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPrompts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      content: "",
      category: "atendimento",
      isActive: true,
      isDefault: false,
    });
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (prompt: ChatPrompt) => {
    setForm({
      name: prompt.name,
      content: prompt.content,
      category: prompt.category,
      isActive: prompt.isActive,
      isDefault: prompt.isDefault,
    });
    setEditing(prompt);
    setShowForm(true);
  };

  const savePrompt = async () => {
    if (!form.name.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await fetch("/api/chat/prompts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...form }),
        });
      } else {
        await fetch("/api/chat/prompts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      resetForm();
      fetchPrompts();
    } catch {
      alert("Erro ao salvar prompt");
    }
    setSaving(false);
  };

  const deletePrompt = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este prompt?")) return;
    await fetch("/api/chat/prompts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (editing?.id === id) resetForm();
    fetchPrompts();
  };

  const toggleActive = async (prompt: ChatPrompt) => {
    await fetch("/api/chat/prompts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: prompt.id, isActive: !prompt.isActive }),
    });
    fetchPrompts();
  };

  const categoryLabel = (cat: string) =>
    CATEGORIES.find((c) => c.value === cat)?.label || cat;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-purple-400" />
              Prompts de Atendimento
            </h1>
            <p className="text-gray-400 mt-1">
              Crie instruções que a IA seguirá ao atender visitantes
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Prompt
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Prompts List */}
          <div className="lg:w-1/2 space-y-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : prompts.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/50 border border-gray-800 rounded-2xl">
                <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum prompt criado</p>
                <p className="text-gray-600 text-sm mt-1">
                  Clique em "Novo Prompt" para criar instruções para a IA
                </p>
              </div>
            ) : (
              prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className={`bg-gray-900/50 border rounded-xl p-4 transition-colors cursor-pointer ${
                    editing?.id === prompt.id
                      ? "border-purple-500/50 bg-purple-500/5"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                  onClick={() => startEdit(prompt)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {prompt.name}
                        </h3>
                        {prompt.isDefault && (
                          <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full">
                          {categoryLabel(prompt.category)}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            prompt.isActive
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-gray-700/50 text-gray-500"
                          }`}
                        >
                          {prompt.isActive ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {prompt.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleActive(prompt);
                        }}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                        title={prompt.isActive ? "Desativar" : "Ativar"}
                      >
                        {prompt.isActive ? (
                          <ToggleRight className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePrompt(prompt.id);
                        }}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Editor */}
          <div className="lg:w-1/2">
            {showForm ? (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-5 sticky top-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-purple-400" />
                    {editing ? "Editar Prompt" : "Novo Prompt"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Prompt
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Atendimento inicial, FAQ preços..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Categoria
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Conteúdo do Prompt
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    rows={10}
                    placeholder="Exemplo:&#10;&#10;Você é um especialista em vendas da J4 Sistemas.&#10;&#10;Regras:&#10;- Sempre pergunte o orçamento do cliente&#10;- Ofereça desconto para projetos acima de R$ 50.000&#10;- Destaque nossos diferenciais: suporte 24/7 e entregas ágeis"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm resize-y min-h-[200px]"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    {form.content.length} caracteres
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        setForm({ ...form, isActive: e.target.checked })
                      }
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <span className="text-sm text-gray-300">Ativo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(e) =>
                        setForm({ ...form, isDefault: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span className="text-sm text-gray-300">
                      Padrão (sempre carregado)
                    </span>
                  </label>
                </div>

                <button
                  onClick={savePrompt}
                  disabled={saving || !form.name.trim() || !form.content.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl transition-colors font-medium"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editing ? "Atualizar Prompt" : "Salvar Prompt"}
                </button>
              </div>
            ) : (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
                <FileText className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                <h3 className="text-gray-400 font-semibold mb-2">
                  Selecione ou crie um prompt
                </h3>
                <p className="text-gray-600 text-sm">
                  Clique em um prompt existente para editar, ou crie um novo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
          <h3 className="text-blue-400 text-sm font-semibold mb-1">
            💡 Como funcionam os prompts
          </h3>
          <ul className="text-gray-400 text-xs space-y-1">
            <li>
              • Prompts <strong>ativos</strong> são carregados automaticamente pela IA
              em cada conversa
            </li>
            <li>
              • Prompts <strong>padrão</strong> são sempre carregados primeiro, seguidos
              pelos demais
            </li>
            <li>
              • As instruções do prompt são <strong>adicionadas</strong> ao contexto
              base da empresa
            </li>
            <li>
              • Use categorias para organizar: atendimento, vendas, suporte, FAQ
            </li>
            <li>
              • Você pode criar prompts para situações específicas e ativar/desativar
              conforme necessário
            </li>
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
}