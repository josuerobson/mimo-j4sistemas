"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/admin/DashboardShell";
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  RefreshCw,
  X,
  Pencil,
  Trash2,
  Building,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserPlus,
  FileText,
  Server,
  Globe,
  HardDrive,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string | null;
}

interface Service {
  id: string;
  clientId: string;
  client: Client;
  type: "hospedagem" | "vps" | "dedicado";
  amount: number;
  cycle: "mensal" | "bimestral" | "trimestral" | "semestral" | "anual";
  lastPaymentDate: string;
  nextRenewalDate: string;
  status: "ativo" | "suspenso" | "cancelado";
  createdAt: string;
}

const serviceTypeOptions = [
  { value: "hospedagem", label: "Hospedagem de site", icon: Globe },
  { value: "vps", label: "VPS", icon: Server },
  { value: "dedicado", label: "Servidor Dedicado", icon: HardDrive },
];

const cycleOptions = [
  { value: "mensal", label: "Mensal", months: 1 },
  { value: "bimestral", label: "Bimestral", months: 2 },
  { value: "trimestral", label: "Trimestral", months: 3 },
  { value: "semestral", label: "Semestral", months: 6 },
  { value: "anual", label: "Anual", months: 12 },
];

const statusOptions = [
  { value: "ativo", label: "Ativo", color: "bg-emerald-500/20 text-emerald-400" },
  { value: "suspenso", label: "Suspenso", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "cancelado", label: "Cancelado", color: "bg-red-500/20 text-red-400" },
];

const emptyForm = {
  clientId: "",
  type: "hospedagem" as Service["type"],
  amount: "",
  cycle: "mensal" as Service["cycle"],
  lastPaymentDate: "",
  status: "ativo" as Service["status"],
};

export default function ServiceManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterType, setFilterType] = useState("todos");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [invoiceService, setInvoiceService] = useState<Service | null>(null);
  const [invoiceProvider, setInvoiceProvider] = useState<"infinitipay" | "cora">(
    "infinitipay"
  );
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [invoiceResult, setInvoiceResult] = useState<{
    link?: string;
    slug?: string;
    documentUrl?: string;
    barcode?: string;
    digitableLine?: string;
  } | null>(null);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [invoiceErrorDetails, setInvoiceErrorDetails] = useState<string | null>(null);

  const fetchServices = () => {
    setLoading(true);
    return fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchClients = () => {
    return fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        const activeClients = data.filter(
          (c: Client & { status?: string }) => c.status !== "inativo"
        );
        setClients(activeClients);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch("/api/services", { signal: controller.signal }).then((res) => res.json()),
      fetch("/api/clients", { signal: controller.signal }).then((res) => res.json()),
    ])
      .then(([servicesData, clientsData]) => {
        setServices(servicesData);
        const activeClients = clientsData.filter(
          (c: Client & { status?: string }) => c.status !== "inativo"
        );
        setClients(activeClients);
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const openForm = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setForm({
        clientId: service.clientId,
        type: service.type,
        amount: service.amount.toString(),
        cycle: service.cycle,
        lastPaymentDate: service.lastPaymentDate.split("T")[0],
        status: service.status,
      });
    } else {
      setEditingService(null);
      setForm(emptyForm);
    }
    setFormError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingService(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const amount = Number(form.amount.replace(",", "."));
    if (!form.clientId || !form.type || isNaN(amount) || amount <= 0 || !form.lastPaymentDate) {
      setFormError("Preencha todos os campos obrigatórios com valores válidos");
      setSaving(false);
      return;
    }

    const method = editingService ? "PATCH" : "POST";
    const body = editingService
      ? { id: editingService.id, ...form, amount }
      : { ...form, amount };

    try {
      const res = await fetch("/api/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Erro ao salvar serviço");
        setSaving(false);
        return;
      }

      closeForm();
      fetchServices();
    } catch {
      setFormError("Erro ao salvar serviço");
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
    await fetch("/api/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchServices();
    setActionMenuId(null);
  };

  const generateInvoice = async () => {
    if (!invoiceService) return;
    setGeneratingInvoice(true);
    setInvoiceResult(null);
    setInvoiceError(null);
    setInvoiceErrorDetails(null);

    try {
      const endpoint =
        invoiceProvider === "cora"
          ? "/api/cora/create-boleto"
          : "/api/infinitipay/create-link";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: invoiceService.id,
          description: `${getTypeLabel(invoiceService.type)} - ${invoiceService.client.name}`,
          orderNsu: `SVC-${invoiceService.id}-${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setInvoiceError(data.error || "Erro ao gerar fatura");
        setInvoiceErrorDetails(
          data.details ? JSON.stringify(data.details, null, 2) : null
        );
      } else if (invoiceProvider === "cora") {
        if (data.documentUrl || data.coraResponse?.document_url) {
          setInvoiceResult({
            documentUrl: data.documentUrl || data.coraResponse?.document_url,
            barcode: data.barcode || data.coraResponse?.barcode,
            digitableLine: data.digitableLine || data.coraResponse?.digitable_line,
          });
        } else {
          setInvoiceError("Boleto não retornado pela Cora");
        }
      } else if (data.link) {
        setInvoiceResult({ link: data.link, slug: data.slug || "" });
      } else {
        setInvoiceError("Link de pagamento não retornado pela InfinitePay");
      }
    } catch {
      setInvoiceError("Erro ao comunicar com o servidor");
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const closeInvoiceModal = () => {
    setInvoiceService(null);
    setInvoiceProvider("infinitipay");
    setInvoiceResult(null);
    setInvoiceError(null);
    setInvoiceErrorDetails(null);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getRenewalStatus = (nextRenewalDate: string) => {
    const next = new Date(nextRenewalDate);
    const now = new Date();
    const diff = next.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);

    if (days < 0) {
      return { label: "Vencido", color: "bg-red-500/20 text-red-400" };
    }
    if (days <= 7) {
      return { label: "Próximo (7 dias)", color: "bg-yellow-500/20 text-yellow-400" };
    }
    return { label: "Em dia", color: "bg-emerald-500/20 text-emerald-400" };
  };

  const getTypeLabel = (type: string) => {
    return serviceTypeOptions.find((t) => t.value === type)?.label || type;
  };

  const getCycleLabel = (cycle: string) => {
    return cycleOptions.find((c) => c.value === cycle)?.label || cycle;
  };

  const getStatusColor = (status: string) => {
    return (
      statusOptions.find((s) => s.value === status)?.color ||
      "bg-gray-500/20 text-gray-400"
    );
  };

  const getStatusLabel = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.label || status;
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      search === "" ||
      service.client.name.toLowerCase().includes(search.toLowerCase()) ||
      service.client.email.toLowerCase().includes(search.toLowerCase()) ||
      service.client.company?.toLowerCase().includes(search.toLowerCase()) ||
      getTypeLabel(service.type).toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "todos" || service.status === filterStatus;
    const matchesType =
      filterType === "todos" || service.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const activeServices = services.filter((s) => s.status === "ativo").length;
  const suspendedServices = services.filter((s) => s.status === "suspenso").length;
  const overdueServices = services.filter(
    (s) => s.status === "ativo" && new Date(s.nextRenewalDate) < new Date()
  ).length;
  const upcomingServices = services.filter((s) => {
    const next = new Date(s.nextRenewalDate);
    const now = new Date();
    const diff = next.getTime() - now.getTime();
    return s.status === "ativo" && diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  const totalMonthlyRevenue = services
    .filter((s) => s.status === "ativo")
    .reduce((sum, s) => {
      const months = cycleOptions.find((c) => c.value === s.cycle)?.months || 1;
      return sum + s.amount / months;
    }, 0);

  const stats = [
    {
      label: "Serviços ativos",
      value: activeServices,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Renovações vencidas",
      value: overdueServices,
      icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      label: "Renovações em 7 dias",
      value: upcomingServices,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Receita mensal estimada",
      value: formatCurrency(totalMonthlyRevenue),
      icon: CreditCard,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Cobranças recorrentes
            </h1>
            <p className="text-gray-400 mt-1">
              Cadastre serviços, controle renovações e gere faturas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchServices();
                fetchClients();
              }}
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
              Novo serviço
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl border border-gray-800 bg-gray-900/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-gray-400 text-xs">{stat.label}</p>
              <p className="text-xl font-bold text-white mt-0.5">{stat.value}</p>
            </div>
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
              placeholder="Buscar por cliente, email, empresa ou tipo de serviço..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm appearance-none cursor-pointer"
            >
              <option value="todos">Todos os tipos</option>
              {serviceTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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

        {/* Form */}
        {isFormOpen && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                {editingService ? "Editar serviço" : "Cadastrar novo serviço"}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm text-gray-400 mb-1.5">Cliente *</label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={form.clientId}
                    onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name} {client.company ? `(${client.company})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Tipo de serviço *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as Service["type"] })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm appearance-none cursor-pointer"
                  >
                    {serviceTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Valor cobrado *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="0,00"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Ciclo de pagamento *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={form.cycle}
                    onChange={(e) => setForm({ ...form, cycle: e.target.value as Service["cycle"] })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm appearance-none cursor-pointer"
                  >
                    {cycleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Último pagamento *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    value={form.lastPaymentDate}
                    onChange={(e) => setForm({ ...form, lastPaymentDate: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Status</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Service["status"] })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm appearance-none cursor-pointer"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl transition-colors text-sm font-medium flex items-center gap-2"
                >
                  {saving && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {editingService ? "Salvar alterações" : "Cadastrar serviço"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Relatório de serviços</h2>
            <span className="text-sm text-gray-400">
              {filteredServices.length} serviço(s)
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 mt-3">Carregando serviços...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400">
                {search || filterStatus !== "todos" || filterType !== "todos"
                  ? "Nenhum serviço encontrado com esses filtros"
                  : "Nenhum serviço cadastrado ainda"}
              </p>
              {!search && filterStatus === "todos" && filterType === "todos" && (
                <button
                  onClick={() => openForm()}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Cadastrar primeiro serviço
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Cliente
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Serviço
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
                      Valor / Ciclo
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Último pagamento
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Próxima renovação
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Status
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredServices.map((service) => {
                    const renewalStatus = getRenewalStatus(service.nextRenewalDate);
                    return (
                      <tr
                        key={service.id}
                        className="hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">
                            {service.client.name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3" />
                            {service.client.company || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-white">
                            {getTypeLabel(service.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <div className="text-sm text-white">
                            {formatCurrency(service.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getCycleLabel(service.cycle)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {formatDate(service.lastPaymentDate)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-white">
                            {formatDate(service.nextRenewalDate)}
                          </div>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${renewalStatus.color}`}
                          >
                            {renewalStatus.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              service.status
                            )}`}
                          >
                            {getStatusLabel(service.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActionMenuId(
                                  actionMenuId === service.id ? null : service.id
                                );
                              }}
                              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            >
                              <span className="sr-only">Ações</span>
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>

                            {actionMenuId === service.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-10 py-1">
                                <button
                                  onClick={() => {
                                    setActionMenuId(null);
                                    setInvoiceService(service);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                                >
                                  <FileText className="w-4 h-4" />
                                  Gerar fatura
                                </button>
                                <button
                                  onClick={() => {
                                    setActionMenuId(null);
                                    openForm(service);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => deleteService(service.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Excluir
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {invoiceService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Gerar fatura</h2>
              <button
                onClick={closeInvoiceModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Meio de pagamento
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setInvoiceProvider("infinitipay")}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                    invoiceProvider === "infinitipay"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  InfinitePay
                </button>
                <button
                  onClick={() => setInvoiceProvider("cora")}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                    invoiceProvider === "cora"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  Cora (boleto)
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Cliente</span>
                <span className="text-white">{invoiceService.client.name}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Serviço</span>
                <span className="text-white">{getTypeLabel(invoiceService.type)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Valor</span>
                <span className="text-white">{formatCurrency(invoiceService.amount)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Ciclo</span>
                <span className="text-white">{getCycleLabel(invoiceService.cycle)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Próxima renovação</span>
                <span className="text-white">{formatDate(invoiceService.nextRenewalDate)}</span>
              </div>
            </div>

            {invoiceError && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {invoiceError}
                </div>
                {invoiceErrorDetails && (
                  <pre className="text-xs bg-red-500/5 p-2 rounded-lg overflow-auto max-h-32 text-red-300">
                    {invoiceErrorDetails}
                  </pre>
                )}
              </div>
            )}

            {invoiceResult && (
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-3">
                <p className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Fatura gerada com sucesso!
                </p>

                {invoiceProvider === "infinitipay" && invoiceResult.link && (
                  <>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Link de pagamento</p>
                      <a
                        href={invoiceResult.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 break-all"
                      >
                        {invoiceResult.link}
                      </a>
                    </div>
                    <button
                      onClick={() =>
                        invoiceResult.link && navigator.clipboard.writeText(invoiceResult.link)
                      }
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Copiar link
                    </button>
                  </>
                )}

                {invoiceProvider === "cora" && invoiceResult.documentUrl && (
                  <>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">PDF do boleto</p>
                      <a
                        href={invoiceResult.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 break-all"
                      >
                        {invoiceResult.documentUrl}
                      </a>
                    </div>
                    {invoiceResult.digitableLine && (
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Linha digitável</p>
                        <p className="text-sm text-white break-all font-mono">
                          {invoiceResult.digitableLine}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        invoiceResult.digitableLine &&
                        navigator.clipboard.writeText(invoiceResult.digitableLine)
                      }
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Copiar linha digitável
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeInvoiceModal}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors text-sm"
              >
                Fechar
              </button>
              <button
                onClick={generateInvoice}
                disabled={generatingInvoice || !!invoiceResult}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-colors text-sm font-medium"
              >
                {generatingInvoice ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Gerando...
                  </span>
                ) : invoiceResult ? (
                  "Fatura gerada"
                ) : (
                  "Gerar fatura"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
