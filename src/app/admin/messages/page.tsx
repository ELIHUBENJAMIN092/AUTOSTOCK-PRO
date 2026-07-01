"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Mail, MailOpen, Calendar, ArrowRight } from "lucide-react";
import ScrollToTop from "@/app/components/ScrollToTop";
import Button from '@/app/components/ui/Button'

type Message = {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Message | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const pageCount = Math.max(1, Math.ceil(total / limit));

  const fetchMessages = async (all: boolean, pageNum = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contact?all=${all}&page=${pageNum}&limit=${limit}`);
      const data = await res.json();
      setMessages(data.messages ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setMessages([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchMessages(showAll, 1);
  }, [showAll]);

  useEffect(() => {
    fetchMessages(showAll, page);
  }, [page]);

  const toggleRead = async (id: string, isRead: boolean) => {
    const res = await fetch("/api/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isRead: !isRead }),
    });

    if (res.ok) {
      toast.success(isRead ? "Marcado como no leído" : "Marcado como leído");
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: !isRead } : m))
      );
      if (selected?._id === id) {
        setSelected((prev) => prev && { ...prev, isRead: !isRead });
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full overflow-x-hidden text-white space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Consultas</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Mensajes recibidos desde el formulario de contacto
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
            className="accent-cyan-500"
          />
          Mostrar leídos
        </label>
      </div>

      {!loading && total > 0 && (
        <p className="text-sm text-neutral-500">
          Mostrando {messages.length} de {total} mensaje{total !== 1 ? "s" : ""}
        </p>
      )}

      {loading ? (
        <div className="text-center py-20 text-neutral-500">Cargando...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-neutral-500">
          {showAll ? "No hay mensajes" : "No hay mensajes sin leer"}
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              onClick={() => setSelected(msg)}
              className={`rounded-2xl border p-5 cursor-pointer transition ${
                msg.isRead
                  ? "border-neutral-800 bg-neutral-900/50"
                  : "border-cyan-700/30 bg-neutral-900 shadow-md shadow-cyan-500/5"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {msg.isRead ? (
                    <MailOpen size={18} className="text-neutral-500 shrink-0 mt-0.5" />
                  ) : (
                    <Mail size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${msg.isRead ? "text-neutral-400" : "text-white font-medium"}`}>
                      {msg.name}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">{msg.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="text-xs text-neutral-500 flex items-center gap-1 whitespace-nowrap">
                    <Calendar size={12} />
                    {formatDate(msg.createdAt)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRead(msg._id, msg.isRead);
                    }}
                    className={`text-xs px-3 py-1 rounded-full border transition whitespace-nowrap ${
                      msg.isRead
                        ? "border-neutral-700 text-neutral-500 hover:border-cyan-600 hover:text-cyan-300"
                        : "border-cyan-700/40 text-cyan-300 hover:bg-cyan-500/10"
                    }`}
                  >
                    {msg.isRead ? "No leído" : "Leído"}
                  </button>
                </div>
              </div>

              <p className={`mt-3 text-sm line-clamp-2 ${msg.isRead ? "text-neutral-500" : "text-neutral-300"}`}>
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal detalle */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-2xl"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 text-neutral-500 hover:text-white transition text-lg"
              title="Cerrar"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              {selected.isRead ? (
                <MailOpen size={20} className="text-neutral-500" />
              ) : (
                <Mail size={20} className="text-cyan-400" />
              )}
              <div>
                <p className="text-lg font-semibold text-white">{selected.name}</p>
                <p className="text-sm text-neutral-400">{selected.email}</p>
              </div>
            </div>

            <p className="text-xs text-neutral-500 mb-4 flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(selected.createdAt)}
            </p>

            <div className="bg-neutral-800 rounded-xl p-4 text-neutral-200 text-sm whitespace-pre-wrap leading-relaxed">
              {selected.message}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => toggleRead(selected._id, selected.isRead)}
                className={`text-xs px-4 py-2 rounded-full border transition ${
                  selected.isRead
                    ? "border-neutral-700 text-neutral-500 hover:border-cyan-600 hover:text-cyan-300"
                    : "border-cyan-700/40 text-cyan-300 hover:bg-cyan-500/10"
                }`}
              >
                {selected.isRead ? "Marcar como no leído" : "Marcar como leído"}
              </button>
            </div>
          </div>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-950/50 px-4 py-3 text-sm text-neutral-400">
          <p>
            Página {page} de {pageCount} ({total} mensajes)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-xl border border-neutral-700 px-3 py-1.5 text-neutral-300 hover:text-white transition disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(Math.min(pageCount, page + 1))}
              disabled={page === pageCount}
              className="inline-flex items-center gap-1 rounded-xl border border-neutral-700 px-3 py-1.5 text-neutral-300 hover:text-white transition disabled:opacity-40"
            >
              Siguiente <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      <ScrollToTop />
    </div>
  );
}
