"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  categories: any[];
  onSuccess?: () => void;
}

export default function ProductForm({ categories, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    minStock: "5",
    category: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.code || !form.name || !form.price || !form.category) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/products", {
        code: form.code,
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        minStock: Number(form.minStock),
        category: form.category,
      });

      toast.success("Producto creado correctamente");

      setForm({
        code: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        minStock: "5",
        category: "",
      });

      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error creando producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl"
    >
      {/* Número de parte */}
      <div>
        <label className="block text-sm font-medium">Número de parte *</label>
        <input
          type="text"
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Ej: ZEB-ZC300-HEAD-300DPI"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium">Nombre *</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Precio */}
      <div>
        <label className="block text-sm font-medium">Precio *</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium">Stock</label>
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-medium">Categoría *</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Seleccione</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Guardando..." : "Guardar producto"}
      </button>
    </form>
  );
}
