"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ScrollToTop from "@/app/components/ScrollToTop";
import Button from '@/app/components/ui/Button'
import { Skeleton } from '@/app/components/ui/Skeleton'
import ConfirmModal from '@/app/components/ui/ConfirmModal'


type Category = {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // ✅ NUEVO: controlar si se muestran inactivas
  const [showInactive, setShowInactive] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setLoading(false);
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchCategories();
  }, []);

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) throw new Error();

      toast.success("Categoría creada correctamente");
      setName("");
      setDescription("");
      fetchCategories();
    } catch {
      toast.error("Error al crear la categoría");
    }
  };

  const toggleCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}/toggle`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error();

      toast.success("Estado actualizado");
      fetchCategories();
    } catch {
      toast.error("Error al actualizar la categoría");
    }
  };

  const confirmToggle = async () => {
    if (!toggleTarget) return;
    await toggleCategory(toggleTarget._id);
    setToggleTarget(null);
  };

  return (
    <div className="w-full overflow-x-hidden px-4 md:px-6 text-white max-w-screen-xl mx-auto py-6">
      <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-900 p-6 shadow-2xl shadow-cyan-500/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Panel de categorías</p>
            <h1 className="text-3xl font-bold text-white">Gestión de categorías</h1>
            <p className="mt-2 max-w-2xl text-neutral-300">
              Crea y administra las categorías del inventario con un control rápido de estado activo o inactivo.
            </p>
          </div>

            <Button
              onClick={() => setShowInactive(!showInactive)}
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${showInactive
                ? "border border-emerald-400 bg-emerald-500/15 text-emerald-200"
                : "border border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-400 hover:text-emerald-200"
              }`}
            >
              {showInactive ? "Ocultar inactivas" : "Mostrar inactivas"}
            </Button>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-[1.5rem] border border-neutral-800 bg-neutral-950/90 p-6 shadow-xl shadow-black/10">
          <h2 className="text-xl font-semibold text-white mb-4">Agregar categoría</h2>
          <form onSubmit={createCategory} className="space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              className="w-full rounded-2xl border border-neutral-800 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              required
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción"
              className="w-full rounded-2xl border border-neutral-800 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 min-h-[120px]"
            />

            <Button className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400">Crear categoría</Button>
          </form>
        </div>

        <div className="rounded-[1.5rem] border border-neutral-800 bg-neutral-950/90 p-6 shadow-xl shadow-black/10">
          <h2 className="text-xl font-semibold text-white mb-4">Resumen</h2>
          <div className="space-y-3 text-sm text-neutral-300">
            <p>Total de categorías: <span className="font-semibold text-white">{categories.length}</span></p>
            <p>{showInactive ? "Se muestran todas las categorías, incluidas las inactivas." : "Solo se muestran categorías activas."}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-[1.5rem]" />
          ))}
        </div>
      ) : categories.filter((cat) => showInactive || cat.isActive).length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/50 p-8 text-center">
          <p className="text-neutral-400">No hay categorías {showInactive ? "" : "activas"}.</p>
          <p className="text-sm text-neutral-600 mt-1">Crea una categoría para comenzar.</p>
        </div>
      ) : (
      <ul className="grid gap-4">
        {categories
          .filter((cat) => showInactive || cat.isActive)
          .map((cat) => (
            <li
              key={cat._id}
              className={`rounded-[1.5rem] border border-neutral-800 bg-slate-950/90 p-5 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-cyan-500 ${cat.isActive ? "" : "opacity-90"}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">{cat.name}</p>
                  {cat.description && (
                    <p className="mt-1 text-sm text-neutral-400">{cat.description}</p>
                  )}
                </div>

                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${cat.isActive ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`}>
                  {cat.isActive ? "Activa" : "Inactiva"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-neutral-500">ID: {cat._id.slice(0, 8)}...</span>
                <Button onClick={() => setToggleTarget(cat)} className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${cat.isActive ? "bg-rose-500 text-white hover:bg-rose-400" : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"}`}>{cat.isActive ? "Desactivar" : "Activar"}</Button>
              </div>
            </li>
          ))}
      </ul>
      )}

      <ConfirmModal
        open={!!toggleTarget}
        title={toggleTarget?.isActive ? "Desactivar categoría" : "Activar categoría"}
        message={`¿Estás seguro de ${toggleTarget?.isActive ? "desactivar" : "activar"} la categoría "${toggleTarget?.name}"?`}
        confirmLabel={toggleTarget?.isActive ? "Desactivar" : "Activar"}
        onConfirm={confirmToggle}
        onCancel={() => setToggleTarget(null)}
      />

      <ScrollToTop />
    </div>
  );
}
