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
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-950 text-white font-montserrat">

      {/* HEADER MOBILE */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-neutral-800">
        <span className="font-bold text-lg">PANEL ADMIN</span>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-2xl"
        >
          ☰
        </button>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-40 w-64 h-full bg-neutral-950 border-r border-neutral-800 p-6
          transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between md:justify-start mb-8">
          <span className="font-bold text-2xl">PANEL ADMIN</span>

          <button
            onClick={() => setMenuOpen(false)}
            className="md:hidden text-xl"
          >
            ✕
          </button>
        </div>

        {/* NAV */}
        <nav className="space-y-4 mb-6">

          <Link
            href="/admin"
            className="block hover:text-gray-300"
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/categories"
            className="block hover:text-gray-300"
            onClick={handleLinkClick}
          >
            Categorías
          </Link>

          <Link
            href="/admin/products"
            className="block hover:text-gray-300"
            onClick={handleLinkClick}
          >
            Productos
          </Link>

          <Link
            href="/admin/rfid"
            className="block hover:text-gray-300"
            onClick={handleLinkClick}
          >
            RFID
          </Link>

          {/* ⭐ NUEVO — MODULO IMPRIMIR */}
          <Link
            href="/admin/imprimir"
            className="block hover:text-gray-300"
            onClick={handleLinkClick}
          >
            🖨️ Inventario
          </Link>

        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-auto w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded transition"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main
        className="flex-1 p-6 md:p-8 max-w-screen-xl mx-auto"
        onClick={() => menuOpen && setMenuOpen(false)}
      >
        {children}
      </main>

    </div>
  );
}
