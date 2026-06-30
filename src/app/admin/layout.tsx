"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Tags, Package, Scan, Printer, MessageSquare } from "lucide-react";
import Button from '@/app/components/ui/Button'
import IconButton from '@/app/components/ui/IconButton'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Logout seguro
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
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
          fixed md:static top-0 left-0 z-40 w-72 h-full bg-slate-950 border-r border-slate-800 p-6
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
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-cyan-500/15 hover:text-cyan-200"
            onClick={handleLinkClick}
          >
            <LayoutDashboard size={18} className="text-slate-300" />
            Dashboard
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-cyan-500/15 hover:text-cyan-200"
            onClick={handleLinkClick}
          >
            <Tags size={18} className="text-slate-300" />
            Categorías
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-cyan-500/15 hover:text-cyan-200"
            onClick={handleLinkClick}
          >
            <Package size={18} className="text-slate-300" />
            Productos
          </Link>

          <Link
            href="/admin/rfid"
            className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-cyan-500/15 hover:text-cyan-200"
            onClick={handleLinkClick}
          >
            <Scan size={18} className="text-slate-300" />
            RFID
          </Link>

          <Link
            href="/admin/messages"
            className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-cyan-500/15 hover:text-cyan-200"
            onClick={handleLinkClick}
          >
            <MessageSquare size={18} className="text-slate-300" />
            Consultas
          </Link>

          <Link
            href="/admin/imprimir"
            className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-cyan-500/15 hover:text-cyan-200"
            onClick={handleLinkClick}
          >
            <Printer size={18} className="text-slate-300" />
            Imprimir
          </Link>
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
        className="flex-1 min-h-screen p-6 md:p-8 max-w-screen-xl mx-auto"
        onClick={() => menuOpen && setMenuOpen(false)}
      >
        {children}
      </main>

    </div>
  );
}
