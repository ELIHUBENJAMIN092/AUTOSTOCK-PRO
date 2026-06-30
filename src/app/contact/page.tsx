"use client";

import { useState } from "react";
import Navbar from "@/app/components/layout/Navbar"
import Footer from "@/app/components/layout/Footer"
import toast from "react-hot-toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      setSending(true);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error();

      toast.success("Mensaje enviado correctamente");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Error al enviar el mensaje");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-neutral-100">
        <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-2xl shadow-cyan-500/10">
            <div className="mb-10 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300 mb-3">Contacto</p>
              <h1 className="text-4xl sm:text-5xl font-semibold text-white">Hablemos de tu inventario RFID</h1>
              <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
                ¿Tienes preguntas? Envíanos un mensaje y te responderemos pronto con soluciones para tu control de stock y etiquetas RFID.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Nombre</label>
                  <input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40" placeholder="Tu nombre" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Correo</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40" placeholder="tu@correo.com" />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Mensaje</label>
                <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={8} required className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40" placeholder="Escribe tu consulta aquí..." />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button type="submit" disabled={sending} className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-8 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:opacity-95 disabled:opacity-60">
                  {sending ? "Enviando..." : "Enviar mensaje"}
                </button>
                <p className="text-sm text-slate-500">
                  Respuesta en menos de 24 horas. También puedes contactarnos por teléfono o visitar nuestro sitio.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
