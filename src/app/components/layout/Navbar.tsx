'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <nav className="w-full sticky top-0 z-50 bg-gradient-to-b from-neutral-900 to-neutral-950 border-b border-neutral-800">
      
      {/* CONTENEDOR */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://static.shuffle.dev/uploads/files/ac/ac180bf4933c1e0d7ef4aa78934b884e39b64e5d/logos/logo-78d34ac57821d853aaf47e300463f4f0.png"
              alt="AutoStock Pro"
              className="h-8"
            />
          </Link>

          {/* BOTÓN MOBILE */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden text-neutral-500 text-2xl hover:text-neutral-300 transition"
            aria-label="Abrir menú"
          >
            ☰
          </button>

          {/* MENÚ DESKTOP */}
          <ul className="hidden lg:flex items-center gap-10 text-neutral-500">
            <li>
              <Link href="#inventario" className="hover:text-white transition">
                Inventario
              </Link>
            </li>

            <li>
              <Link href="#categorias" className="hover:text-white transition">
                Categorías
              </Link>
            </li>

            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contacto
              </Link>
            </li>

            <Link
              href="/admin"
              className="ml-4 px-5 py-2 bg-neutral-800 text-neutral-300 rounded-full font-semibold hover:bg-neutral-700 hover:text-white transition"
            >
              Acceso Admin
            </Link>
          </ul>
        </div>
      </div>

      {/* MENÚ MOBILE */}
      {mobileNavOpen && (
        <div className="lg:hidden bg-gradient-to-b from-neutral-900 to-neutral-950 border-t border-neutral-800">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4 text-neutral-500">
            <Link href="#inventario" onClick={() => setMobileNavOpen(false)} className="hover:text-white transition">
              Inventario
            </Link>

            <Link href="#categorias" onClick={() => setMobileNavOpen(false)} className="hover:text-white transition">
              Categorías
            </Link>

            <Link href="/contact" onClick={() => setMobileNavOpen(false)} className="hover:text-white transition">
              Contacto
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileNavOpen(false)}
              className="mt-2 px-5 py-2 bg-neutral-800 text-neutral-300 rounded-full font-semibold text-center hover:bg-neutral-700 hover:text-white transition"
            >
              Acceso Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
