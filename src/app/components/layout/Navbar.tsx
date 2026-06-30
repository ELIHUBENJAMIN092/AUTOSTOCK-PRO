'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Wifi } from "lucide-react";
import LoginModal from '../auth/LoginModal'

export default function Navbar() {
  const router = useRouter()
  const { data: session } = useSession()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const handleAdminClick = () => {
    if (session?.user?.role === "admin") {
      router.push("/admin")
    } else {
      setIsLoginOpen(true)
    }
  }

  return (
    <>
    <nav className="w-full sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/10 shadow-xl shadow-cyan-500/10">
      
      {/* CONTENEDOR */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-24">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20">
              <Wifi size={22} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">RFID</p>
              <span className="text-lg font-semibold text-white">AutoStock Pro</span>
            </div>
          </Link>

          {/* BOTÓN MOBILE */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden text-cyan-200 text-2xl hover:text-white transition"
            aria-label="Abrir menú"
          >
            ☰
          </button>

          {/* MENÚ DESKTOP */}
          <ul className="hidden lg:flex items-center gap-10 text-slate-300">
            <li>
              <Link href="/" className="hover:text-white transition">
                Inicio
              </Link>
            </li>

            <li>
              <Link href="/#inventario" className="hover:text-white transition">
                Inventario
              </Link>
            </li>

            <li>
              <Link href="/#categorias" className="hover:text-white transition">
                Categorías
              </Link>
            </li>

            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contacto
              </Link>
            </li>

            <button
              onClick={handleAdminClick}
              className="ml-4 px-5 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 rounded-full font-semibold shadow-xl shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-sky-400"
            >
              Acceso Admin
            </button>
          </ul>
        </div>
      </div>

      {/* MENÚ MOBILE */}
      {mobileNavOpen && (
        <div className="lg:hidden bg-slate-950/95 border-t border-cyan-500/10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4 text-slate-300">
            <Link href="/" onClick={() => setMobileNavOpen(false)} className="rounded-3xl px-4 py-3 hover:bg-slate-900/80 hover:text-white transition">
              Inicio
            </Link>

            <Link href="/#inventario" onClick={() => setMobileNavOpen(false)} className="rounded-3xl px-4 py-3 hover:bg-slate-900/80 hover:text-white transition">
              Inventario
            </Link>

            <Link href="/#categorias" onClick={() => setMobileNavOpen(false)} className="rounded-3xl px-4 py-3 hover:bg-slate-900/80 hover:text-white transition">
              Categorías
            </Link>

            <Link href="/contact" onClick={() => setMobileNavOpen(false)} className="rounded-3xl px-4 py-3 hover:bg-slate-900/80 hover:text-white transition">
              Contacto
            </Link>

            <button
              onClick={() => {
                setMobileNavOpen(false)
                handleAdminClick()
              }}
              className="mt-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 rounded-full font-semibold text-center shadow-xl shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-sky-400"
            >
              Acceso Admin
            </button>
          </div>
        </div>
      )}

    </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
