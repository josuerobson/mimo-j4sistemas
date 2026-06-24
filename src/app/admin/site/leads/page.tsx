"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/admin/DashboardShell";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Building,
  Calendar,
  MessageSquare,
  Trash2,
  RefreshCw,
  X,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  status: "novo" | "contatado" | "qualificado" | "convertido" | "perdido";
  createdAt: string;
  source: string;
}

const statusOptions = [
  { value: "novo", label: "Novo", color: "bg-blue-500/20 text-blue-400" },
  { value: "contatado", label: "Contatado", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "qualificado", label: "Qualificado", color: "bg-purple-500/20 text-purple-400" },
  { value: "convertido", label: "Convertido", color: "bg-emerald-500/20 text-emerald-400" },
  { value: "perdido", label: "Perdido", color: "bg-red-500/20 text-red-400" },
];

const serviceLabels: Record<string, string> = {
  "desenvolvimento-web": "Desenvolvimento Web",
  "aplicativo-mobile": "Aplicativo Mobile",
  "sistema-sob-medida": "Sistema Sob Medida",
  "consultoria-ti": "Consultoria em TI",
  outro: "Outro",
};

const budgetLabels: Record<string, string> = {
  "5k-15k": "R$ 5.000 - R$ 15.000",
  "15k-30k": "R$ 15.000 - R$ 30.000",
  "30k-60k": "R$ 30.000 - R$ 60.000",
  "60k-100k": "R$ 60.000 - R$ 100.000",
  "100k+": "Acima de R$ 100.000",
  "nao-sei": "Não sei / Preciso de ajuda",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const fetchLeads = () => {
    setLoading(true);
    return fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/leads", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const updateStatus = async (id: string, status: Lead["status"]) => {
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchLeads();
    setActionMenuId(null);
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este lead?")) return;
    await fetch("/api/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchLeads();
    setSelectedLead(null);
    setActionMenuId(null);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      search === "" ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.company?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "todos" || lead.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.color || "bg-gray-500/20 text-gray-400";
  };

  const getStatusLabel = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.label || status;
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Leads do Site
            </h1>
            <p className="text-gray-400 mt-1">
              Gerencie os leads recebidos pelo formulário de contato
            </p>
          </div>
          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-gray-600 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, email ou empresa..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm appearance-none cursor-pointer"
            >
              <option value="todos">Todos os status</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-3">
          {statusOptions.map((opt) => {
            const count = leads.filter((l) => l.status === opt.value).length;
            return (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(filterStatus === opt.value ? "todos" : opt.value)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === opt.value
                    ? "ring-2 ring-blue-500 " + opt.color
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {opt.label}
                <span className="bg-gray-700/50 px-1.5 py-0.5 rounded text-[10px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 mt-3">Carregando leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400">
                {search || filterStatus !== "todos"
                  ? "Nenhum lead encontrado com esses filtros"
                  : "Nenhum lead cadastrado ainda"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Contato
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                      Empresa
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">
                      Serviço
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
                      Data
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-800/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          {lead.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 hidden md:table-cell">
                        {lead.company || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">
                        {serviceLabels[lead.service] || lead.service}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}
                        >
                          {getStatusLabel(lead.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                        {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuId(actionMenuId === lead.id ? null : lead.id);
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {actionMenuId === lead.id && (
                            <div
                              className="absolute right-0 top-8 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-10 py-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <p className="px-3 py-1.5 text-xs text-gray-500 font-medium">
                                Alterar status
                              </p>
                              {statusOptions.map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() => updateStatus(lead.id, opt.value as Lead["status"])}
                                  className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
                                >
                                  <span className={`w-2 h-2 rounded-full ${opt.color.split(" ")[0]}`} />
                                  {opt.label}
                                </button>
                              ))}
                              <hr className="border-gray-700 my-1" />
                              <button
                                onClick={() => deleteLead(lead.id)}
                                className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Excluir lead
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead count */}
        {!loading && (
          <p className="text-sm text-gray-500 text-center">
            Exibindo {filteredLeads.length} de {leads.length} leads
          </p>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                Detalhes do Lead
              </h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {selectedLead.name}
                  </h3>
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedLead.status)}`}
                  >
                    {getStatusLabel(selectedLead.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </div>
                  <p className="text-white text-sm">{selectedLead.email}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Phone className="w-3.5 h-3.5" />
                    Telefone
                  </div>
                  <p className="text-white text-sm">{selectedLead.phone}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Building className="w-3.5 h-3.5" />
                    Empresa
                  </div>
                  <p className="text-white text-sm">
                    {selectedLead.company || "Não informado"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Data
                  </div>
                  <p className="text-white text-sm">
                    {new Date(selectedLead.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-3">
                <div className="text-gray-500 text-xs mb-1">Serviço</div>
                <p className="text-white text-sm">
                  {serviceLabels[selectedLead.service] || selectedLead.service}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-3">
                <div className="text-gray-500 text-xs mb-1">Orçamento</div>
                <p className="text-white text-sm">
                  {budgetLabels[selectedLead.budget] || selectedLead.budget || "Não informado"}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Mensagem
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedLead.message}
                </p>
              </div>

              {/* Status actions */}
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-2 font-medium">
                  Alterar status:
                </p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        updateStatus(selectedLead.id, opt.value as Lead["status"]);
                        setSelectedLead({ ...selectedLead, status: opt.value as Lead["status"] });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedLead.status === opt.value
                          ? "ring-2 ring-blue-500 " + opt.color
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteLead(selectedLead.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Excluir lead
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}