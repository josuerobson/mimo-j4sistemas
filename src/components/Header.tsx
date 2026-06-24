"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Code2, ChevronDown } from "lucide-react";

const navigation = [
  { name: "Início", href: "/" },
  { name: "Sobre", href: "/sobre" },
  {
    name: "Serviços",
    href: "/servicos",
    submenu: [
      { name: "Desenvolvimento Web", href: "/servicos/desenvolvimento-web" },
      { name: "Aplicativos Mobile", href: "/servicos/aplicativos-mobile" },
      { name: "Sistemas Sob Medida", href: "/servicos/sistemas-sob-medida" },
      { name: "Consultoria em TI", href: "/servicos/consultoria-ti" },
    ],
  },
  { name: "Portfólio", href: "/portfolio" },
  { name: "Blog", href: "/blog" },
  { name: "Contato", href: "/contato" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">
                J4<span className="text-blue-400">Sistema</span>
              </span>
              <p className="text-[10px] text-gray-400 -mt-1 tracking-wider uppercase">
                Software Personalizado
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() =>
                  item.submenu && setActiveSubmenu(item.name)
                }
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1 rounded-lg hover:bg-gray-800/50"
                >
                  {item.name}
                  {item.submenu && <ChevronDown className="w-3 h-3" />}
                </Link>
                {item.submenu && activeSubmenu === item.name && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors border-b border-gray-700/50 last:border-0"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contato"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Solicitar Orçamento
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.submenu && (
                  <div className="pl-6">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 px-4">
              <Link
                href="/contato"
                className="block w-full text-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Solicitar Orçamento
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}