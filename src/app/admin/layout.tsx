"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Logout seguro
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      sessionStorage.clear();
    } catch {}

    router.push("/");
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-white font-montserrat">

      {/* HEADER MOBILE */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm shadow-sm shadow-slate-950/20">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Panel Admin</p>
          <span className="font-bold text-lg">autostock pro</span>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-full bg-slate-900/80 p-2 text-white shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-500/90"
          aria-label="Abrir menú"
        >
          ☰
        </button>
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
            <span className="text-sm uppercase tracking-[0.3em] text-cyan-300">Admin</span>
          </div>

          <button
            onClick={() => setMenuOpen(false)}
            className="md:hidden rounded-full bg-slate-900/80 p-2 text-xl text-white shadow-lg shadow-slate-950/20"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 mb-6 shadow-xl shadow-cyan-500/10">
          <p className="text-sm text-slate-400">Vista del panel</p>
          <p className="mt-2 text-lg font-semibold text-white">Control de stock</p>
        </div>

        <nav className="space-y-3 mb-6">
          <Link
            href="/admin"
            className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-cyan-500/15 hover:text-cyan-200"
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/categories"
            className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-cyan-500/15 hover:text-cyan-200"
            onClick={handleLinkClick}
          >
            Categorías
          </Link>

          <Link
            href="/admin/products"
            className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-cyan-500/15 hover:text-cyan-200"
            onClick={handleLinkClick}
          >
            Productos
          </Link>

          <Link
            href="/admin/rfid"
            className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-cyan-500/15 hover:text-cyan-200"
            onClick={handleLinkClick}
          >
            RFID
          </Link>

          <Link
            href="/admin/imprimir"
            className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-cyan-500/15 hover:text-cyan-200"
            onClick={handleLinkClick}
          >
            🖨️ Imprimir
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto w-full rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-2xl shadow-slate-900/15 transition hover:bg-slate-100"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main
        className="flex-1 min-h-screen p-6 md:p-8 max-w-screen-xl mx-auto"
        onClick={() => menuOpen && setMenuOpen(false)}
      >
        <div className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-950/90 p-5 shadow-2xl shadow-cyan-500/10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Administrador</p>
              <h2 className="text-3xl font-bold text-white">Panel de administración</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-900/90 px-4 py-3 text-sm text-slate-300 ring-1 ring-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-md shadow-emerald-500/20" />
              Activo
            </div>
          </div>
        </div>

        {children}
      </main>

    </div>
  );
}
