"use client";

import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // ✅ NUEVO: controlar si se muestran inactivas
  const [showInactive, setShowInactive] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    setName("");
    setDescription("");
    fetchCategories();
  };

  const toggleCategory = async (id: string) => {
    await fetch(`/api/categories/${id}/toggle`, {
      method: "PATCH",
    });

    fetchCategories();
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Categorías</h1>

      {/* ✅ BOTÓN MOSTRAR / OCULTAR INACTIVAS */}
      <button
        onClick={() => setShowInactive(!showInactive)}
        className="mb-6 text-sm underline text-neutral-400"
      >
        {showInactive
          ? "Ocultar categorías inactivas"
          : "Mostrar categorías inactivas"}
      </button>

      {/* Formulario */}
      <form onSubmit={createCategory} className="mb-8 space-y-3 max-w-md">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          className="w-full px-4 py-2 bg-neutral-800 rounded"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
          className="w-full px-4 py-2 bg-neutral-800 rounded"
        />

        <button className="w-full bg-white text-black py-2 rounded font-medium">
          Crear categoría
        </button>
      </form>

      {/* Listado */}
      <ul className="space-y-3">
        {categories
          // ✅ FILTRO: ocultar inactivas por defecto
          .filter((cat) => showInactive || cat.isActive)
          .map((cat) => (
            <li
              key={cat._id}
              className={`p-4 rounded border flex justify-between items-center ${
                cat.isActive
                  ? "bg-neutral-900 border-neutral-800"
                  : "bg-neutral-800 border-red-500 opacity-60"
              }`}
            >
              <div>
                <p className="font-semibold">{cat.name}</p>

                {cat.description && (
                  <p className="text-sm text-neutral-400">
                    {cat.description}
                  </p>
                )}

                {!cat.isActive && (
                  <span className="text-xs text-red-400">
                    Categoría inactiva
                  </span>
                )}
              </div>

              <button
                onClick={() => toggleCategory(cat._id)}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  cat.isActive
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-black"
                }`}
              >
                {cat.isActive ? "Desactivar" : "Activar"}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
