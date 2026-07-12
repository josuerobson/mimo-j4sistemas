"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Users,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Code2,
  BarChart3,
  Briefcase,
  MessagesSquare,
} from "lucide-react";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: "/admin",
  },
  {
    label: "Site",
    icon: <Globe className="w-5 h-5" />,
    children: [
      { label: "Leads do Site", href: "/admin/site/leads" },
    ],
  },
  {
    label: "Clientes",
    icon: <Users className="w-5 h-5" />,
    href: "/admin/clientes",
  },
  {
    label: "Cobranças recorrentes",
    icon: <Briefcase className="w-5 h-5" />,
    href: "/admin/gestao-servicos",
  },
  {
    label: "Mensagens",
    icon: <MessageSquare className="w-5 h-5" />,
    href: "/admin/mensagens",
  },
  {
    label: "Chat",
    icon: <MessagesSquare className="w-5 h-5" />,
    children: [
      { label: "Conversas", href: "/admin/chat" },
      { label: "Integração IA", href: "/admin/chat/integracao" },
      { label: "Prompts", href: "/admin/chat/prompts" },
    ],
  },
  {
    label: "Relatórios",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/admin/relatorios",
  },
  {
    label: "Configurações",
    icon: <Settings className="w-5 h-5" />,
    children: [
      { label: "Integração Whatsapp", href: "/admin/configuracoes/whatsapp" },
      { label: "Integração InfinitiPay", href: "/admin/configuracoes/infinitipay" },
      { label: "Integração Cora", href: "/admin/configuracoes/cora" },
      { label: "Integração Mercado Pago", href: "/admin/configuracoes/mercadopago" },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const toggleSubmenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700/50">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Code2 className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-white whitespace-nowrap">
            J4<span className="text-blue-400">Admin</span>
          </span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          if (item.children) {
            const isOpen = openMenus[item.label];
            const hasActiveChild = item.children.some(
              (child) => pathname === child.href
            );

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    hasActiveChild
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </>
                  )}
                </button>
                {!collapsed && isOpen && (
                  <div className="ml-5 mt-1 space-y-1 border-l border-gray-700 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive(child.href)
                            ? "bg-blue-600/20 text-blue-400 font-medium"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(item.href!)
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="border-t border-gray-700/50 p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-gray-300 hover:text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:block bg-gray-900 border-r border-gray-800 transition-all duration-300 h-screen sticky top-0 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white z-10"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3 rotate-90" />
          )}
        </button>
        {sidebarContent}
      </div>
    </>
  );
}