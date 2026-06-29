"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ImageIcon } from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface Props {
  categories: Category[];
  onCreated?: () => void;
}

export default function ProductForm({ categories, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!code || !name || !price || !category) {
      setError("Completa los campos obligatorios");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("code", code.trim().toUpperCase());
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);

      if (image) {
        formData.append("image", image);
      }

      await axios.post("/api/products", formData);

      // RESET FORM
      setCode("");
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
      setImage(null);

      onCreated?.();

    } catch (err: any) {
      const status = err.response?.status;
      const message = err.response?.data?.error;

      if (status === 409) {
        toast.error("⚠️ Ya existe un producto registrado con este código");
      } else if (message) {
        toast.error(message);
      } else {
        toast.error("Error inesperado al crear producto");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="mb-6 space-y-3">
        <span className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-300">
          Nuevo producto
        </span>
        <div>
          <h2 className="text-2xl font-semibold text-white">Información del producto</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Completa los campos obligatorios y añade una imagen para facilitar la identificación en el inventario.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr] w-full max-w-full">
        <div className="grid gap-4">
          <label className="block text-sm text-neutral-300">
            Código
            <input
              placeholder="Código"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="mt-2 w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </label>

          <label className="block text-sm text-neutral-300">
            Nombre
            <input
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </label>

          <label className="block text-sm text-neutral-300">
            Descripción / ubicación
            <textarea
              rows={3}
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500 resize-none"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-neutral-300">
              Precio
              <input
                type="number"
                placeholder="Precio"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
              />
            </label>

            <label className="block text-sm text-neutral-300">
              Stock
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
              />
            </label>
          </div>

          <label className="block text-sm text-neutral-300">
            Categoría
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            >
              <option value="">Selecciona categoría</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-neutral-800 bg-neutral-950/60 p-5 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Imagen</p>
            <p className="mt-2 text-sm text-neutral-400">
              Sube una foto para mejorar la visualización del producto.
            </p>

            <input
              type="file"
              id="imageUpload"
              hidden
              accept="image/*"
              onChange={(e) => e.target.files && setImage(e.target.files[0])}
            />

            {!image ? (
              <label
                htmlFor="imageUpload"
                className="mt-5 inline-flex h-44 w-full max-w-xs flex-col items-center justify-center rounded-3xl border border-neutral-700 bg-neutral-900 px-4 text-neutral-400 transition hover:border-emerald-400 hover:text-white"
              >
                <ImageIcon size={32} className="text-emerald-400" />
                <span className="mt-3 text-sm text-white">Seleccionar imagen</span>
                <span className="mt-1 text-xs text-neutral-500">
                  JPG, PNG o WEBP · máximo 5 MB
                </span>
              </label>
            ) : (
              <div className="relative mx-auto mt-5 h-44 w-full max-w-xs overflow-hidden rounded-3xl border border-neutral-700 bg-black/20">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Previsualización"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Agregar producto"}
          </button>
        </div>
      </form>
    </div>
  );
}

