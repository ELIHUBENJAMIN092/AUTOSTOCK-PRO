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

      toast.success("Producto creado correctamente ✅");

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
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 max-w-xl mx-auto">

      <h2 className="text-lg font-semibold mb-4">
        Producto
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 md:grid md:grid-cols-3"
      >

        {/* DATOS */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            placeholder="Código"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="bg-neutral-800 px-4 py-2 rounded"
          />

          <input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-neutral-800 px-4 py-2 rounded"
          />

          <input
            placeholder="Ubicación"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-neutral-800 px-4 py-2 rounded md:col-span-2"
          />

          <input
            type="number"
            placeholder="Precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-neutral-800 px-4 py-2 rounded"
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="bg-neutral-800 px-4 py-2 rounded"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-neutral-800 px-4 py-2 rounded md:col-span-2"
          >
            <option value="">Selecciona categoría</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

        </div>

        {/* IMAGEN */}
        <div className="flex justify-center">

          <input
            type="file"
            id="imageUpload"
            hidden
            accept="image/*"
            onChange={(e) =>
              e.target.files && setImage(e.target.files[0])
            }
          />

          {!image ? (
            <label
              htmlFor="imageUpload"
              className="w-44 h-44 border-2 border-dashed
                         border-neutral-600 rounded-xl
                         flex flex-col items-center justify-center
                         cursor-pointer hover:bg-neutral-800 transition"
            >
              <ImageIcon size={40} />
              <span className="text-sm mt-2">Subir imagen</span>
            </label>
          ) : (
            <div className="relative w-44 h-44">
              <img
                src={URL.createObjectURL(image)}
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 bg-black/70
                           w-7 h-7 rounded-full text-white"
              >
                ✕
              </button>
            </div>
          )}

        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-3 bg-white text-black py-3 rounded font-semibold"
        >
          {loading ? "Guardando..." : "Agregar Producto"}
        </button>

      </form>
    </div>
  );
}
