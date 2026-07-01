"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Tags, Package, Scan, Printer, MessageSquare, Home } from "lucide-react";
import Button from '@/app/components/ui/Button'
import IconButton from '@/app/components/ui/IconButton'

const navLinks = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categorías", icon: Tags },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/rfid", label: "RFID", icon: Scan },
  { href: "/admin/messages", label: "Consultas", icon: MessageSquare },
  { href: "/admin/imprimir", label: "Imprimir", icon: Printer },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-white">

      {/* HEADER MOBILE */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm shadow-sm shadow-slate-950/20">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Panel Admin</p>
          <span className="font-bold text-lg">autostock pro</span>
        </div>

        <IconButton
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-full bg-slate-900/80 text-white shadow-lg shadow-cyan-500/10"
          aria-label="Abrir menú"
        >
          ☰
        </IconButton>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-40 w-72 h-full bg-slate-950 border-r border-slate-800 p-6 overflow-y-auto
          transform transition-transform duration-300 ease-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
          </div>

          <IconButton
            onClick={() => setMenuOpen(false)}
            className="md:hidden rounded-full bg-slate-900/80 text-xl text-white shadow-lg shadow-slate-950/20"
            aria-label="Cerrar menú"
          >
            ✕
          </IconButton>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 mb-6 shadow-xl shadow-cyan-500/10">
          <p className="text-sm text-slate-400">Vista del panel</p>
          <p className="mt-2 text-lg font-semibold text-white">Control de stock</p>
        </div>

        <nav className="space-y-3 mb-6">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-cyan-500/20 text-cyan-200"
                    : "text-slate-200 hover:bg-cyan-500/15 hover:text-cyan-200"
                }`}
              >
                <Icon size={18} className={active ? "text-cyan-300" : "text-slate-300"} />
                {label}
              </Link>
            );
          })}
        </nav>

        <Button
          onClick={handleLogout}
          className="mt-auto w-full rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-2xl shadow-slate-900/15 transition hover:bg-slate-100"
        >
          Cerrar sesión
        </Button>
      </aside>

      {/* CONTENIDO */}
      <main
        className="flex-1 min-h-screen p-4 md:p-8 max-w-screen-xl mx-auto overflow-x-hidden"
        onClick={() => menuOpen && setMenuOpen(false)}
      >
        {children}
      </main>

    </div>
  );
}
