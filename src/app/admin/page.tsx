"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/admin/DashboardShell";
import {
  Users,
  TrendingUp,
  MessageSquare,
  Clock,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "novo").length;
  const qualifiedLeads = leads.filter((l) => l.status === "qualificado").length;
  const convertedLeads = leads.filter((l) => l.status === "convertido").length;

  const stats = [
    {
      label: "Total de Leads",
      value: totalLeads,
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
    },
    {
      label: "Novos Leads",
      value: newLeads,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-400",
    },
    {
      label: "Qualificados",
      value: qualifiedLeads,
      icon: <MessageSquare className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
    },
    {
      label: "Convertidos",
      value: convertedLeads,
      icon: <Clock className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-400",
    },
  ];

  const recentLeads = leads.slice(0, 5);

  const statusColors: Record<string, string> = {
    novo: "bg-blue-500/20 text-blue-400",
    contatado: "bg-yellow-500/20 text-yellow-400",
    qualificado: "bg-purple-500/20 text-purple-400",
    convertido: "bg-emerald-500/20 text-emerald-400",
    perdido: "bg-red-500/20 text-red-400",
  };

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Visão geral do seu painel administrativo
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor}`}
                >
                  {stat.icon}
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? "..." : stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Leads */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">
              Leads Recentes
            </h2>
            <Link
              href="/admin/site/leads"
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 mt-3">Carregando...</p>
            </div>
          ) : recentLeads.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400">Nenhum lead encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Nome
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
                      Empresa
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                      Serviço
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          {lead.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {lead.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 hidden sm:table-cell">
                        {lead.company || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 hidden md:table-cell">
                        {lead.service}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusColors[lead.status] || "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                        {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/site/leads"
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition-colors group"
          >
            <Users className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-1">Ver Leads</h3>
            <p className="text-gray-500 text-sm">
              Gerenciar leads do site
            </p>
          </Link>
          <Link
            href="/"
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors group"
          >
            <MessageSquare className="w-8 h-8 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-1">Ver Site</h3>
            <p className="text-gray-500 text-sm">
              Acessar o site público
            </p>
          </Link>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-colors group cursor-pointer">
            <TrendingUp className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-1">Relatórios</h3>
            <p className="text-gray-500 text-sm">
              Visualizar métricas
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}