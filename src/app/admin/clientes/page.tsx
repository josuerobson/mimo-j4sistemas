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
  Plus,
  RefreshCw,
  X,
  Pencil,
  Trash2,
  MapPin,
  FileText,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserPlus,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  document: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  notes: string | null;
  status: "ativo" | "inativo" | "prospecto" | "inadimplente";
  source: string;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: "ativo", label: "Ativo", color: "bg-emerald-500/20 text-emerald-400" },
  { value: "inativo", label: "Inativo", color: "bg-gray-500/20 text-gray-400" },
  { value: "prospecto", label: "Prospecto", color: "bg-blue-500/20 text-blue-400" },
  { value: "inadimplente", label: "Inadimplente", color: "bg-red-500/20 text-red-400" },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  document: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  notes: "",
  status: "ativo" as Client["status"],
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchClients = () => {
    setLoading(true);
    return fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/clients", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const openForm = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setForm({
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company || "",
        document: client.document || "",
        address: client.address || "",
        city: client.city || "",
        state: client.state || "",
        zipCode: client.zipCode || "",
        notes: client.notes || "",
        status: client.status,
      });
    } else {
      setEditingClient(null);
      setForm(emptyForm);
    }
    setFormError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingClient(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const method = editingClient ? "PATCH" : "POST";
    const body = editingClient ? { id: editingClient.id, ...form } : form;

    try {
      const res = await fetch("/api/clients", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Erro ao salvar cliente");
        setSaving(false);
        return;
      }

      closeForm();
      fetchClients();
    } catch {
      setFormError("Erro ao salvar cliente");
    } finally {
      setSaving(false);
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
    await fetch("/api/clients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchClients();
    setSelectedClient(null);
    setActionMenuId(null);
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      search === "" ||
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.company?.toLowerCase().includes(search.toLowerCase()) ||
      client.document?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "todos" || client.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return (
      statusOptions.find((s) => s.value === status)?.color ||
      "bg-gray-500/20 text-gray-400"
    );
  };

  const getStatusLabel = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.label || status;
  };

  const statusCounts = {
    ativo: clients.filter((c) => c.status === "ativo").length,
    inativo: clients.filter((c) => c.status === "inativo").length,
    prospecto: clients.filter((c) => c.status === "prospecto").length,
    inadimplente: clients.filter((c) => c.status === "inadimplente").length,
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Clientes
            </h1>
            <p className="text-gray-400 mt-1">
              Cadastro completo de clientes e prospects
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchClients}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-gray-600 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </button>
            <button
              onClick={() => openForm()}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Novo cliente
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                setFilterStatus(filterStatus === opt.value ? "todos" : opt.value)
              }
              className={`flex items-center justify-between p-4 rounded-xl border transition-colors text-left ${
                filterStatus === opt.value
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
              }`}
            >
              <div>
                <p className="text-gray-400 text-xs">{opt.label}</p>
                <p className="text-xl font-bold text-white mt-0.5">
                  {statusCounts[opt.value as keyof typeof statusCounts]}
                </p>
              </div>
              <span className={`w-3 h-3 rounded-full ${opt.color.split(" ")[0]}`} />
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, email, empresa ou documento..."
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

        {/* Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 mt-3">Carregando clientes...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400">
                {search || filterStatus !== "todos"
                  ? "Nenhum cliente encontrado com esses filtros"
                  : "Nenhum cliente cadastrado ainda"}
              </p>
              {!search && filterStatus === "todos" && (
                <button
                  onClick={() => openForm()}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Cadastrar primeiro cliente
                </button>
              )}
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
                      Empresa / Documento
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">
                      Localização
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
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-gray-800/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedClient(client)}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          {client.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {client.email}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          {client.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="text-sm text-gray-400">
                          {client.company || "-"}
                        </div>
                        {client.document && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {client.document}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">
                        {client.city && client.state
                          ? `${client.city} / ${client.state}`
                          : client.city || client.state || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            client.status
                          )}`}
                        >
                          {getStatusLabel(client.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                        {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuId(
                                actionMenuId === client.id ? null : client.id
                              );
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {actionMenuId === client.id && (
                            <div
                              className="absolute right-0 top-8 w-40 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-10 py-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => {
                                  openForm(client);
                                  setActionMenuId(null);
                                }}
                                className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                Editar
                              </button>
                              <hr className="border-gray-700 my-1" />
                              <button
                                onClick={() => deleteClient(client.id)}
                                className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Excluir
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

        {/* Count */}
        {!loading && (
          <p className="text-sm text-gray-500 text-center">
            Exibindo {filteredClients.length} de {clients.length} clientes
          </p>
        )}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedClient(null)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                Detalhes do Cliente
              </h2>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {selectedClient.name}
                  </h3>
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      selectedClient.status
                    )}`}
                  >
                    {getStatusLabel(selectedClient.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </div>
                  <p className="text-white text-sm">{selectedClient.email}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Phone className="w-3.5 h-3.5" />
                    Telefone
                  </div>
                  <p className="text-white text-sm">{selectedClient.phone}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Building className="w-3.5 h-3.5" />
                    Empresa
                  </div>
                  <p className="text-white text-sm">
                    {selectedClient.company || "Não informado"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    Documento
                  </div>
                  <p className="text-white text-sm">
                    {selectedClient.document || "Não informado"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 sm:col-span-2">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Endereço
                  </div>
                  <p className="text-white text-sm">
                    {selectedClient.address
                      ? `${selectedClient.address}${
                          selectedClient.city ? `, ${selectedClient.city}` : ""
                        }${selectedClient.state ? ` / ${selectedClient.state}` : ""}${
                          selectedClient.zipCode ? ` - ${selectedClient.zipCode}` : ""
                        }`
                      : "Não informado"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Cadastrado em
                  </div>
                  <p className="text-white text-sm">
                    {new Date(selectedClient.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    Origem
                  </div>
                  <p className="text-white text-sm capitalize">
                    {selectedClient.source}
                  </p>
                </div>
              </div>

              {selectedClient.notes && (
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="text-gray-500 text-xs mb-1">Observações</div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedClient.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    openForm(selectedClient);
                    setSelectedClient(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors text-sm font-medium"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => deleteClient(selectedClient.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={closeForm}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                {editingClient ? "Editar Cliente" : "Novo Cliente"}
              </h2>
              <button
                onClick={closeForm}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400">
                    Nome completo <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    placeholder="exemplo@email.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400">
                    Telefone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400">Empresa</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    placeholder="Nome da empresa"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400">
                    CPF / CNPJ
                  </label>
                  <input
                    type="text"
                    value={form.document}
                    onChange={(e) => setForm({ ...form, document: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as Client["status"] })
                    }
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm appearance-none cursor-pointer"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm text-gray-400">Endereço</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    placeholder="Rua, número, bairro"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400">Cidade</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    placeholder="Cidade"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400">Estado</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400">CEP</label>
                  <input
                    type="text"
                    value={form.zipCode}
                    onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    placeholder="00000-000"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm text-gray-400">Observações</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm resize-none"
                    placeholder="Informações adicionais sobre o cliente..."
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 rounded-xl transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl transition-colors text-sm font-medium"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : editingClient ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {saving
                    ? "Salvando..."
                    : editingClient
                    ? "Salvar alterações"
                    : "Cadastrar cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
