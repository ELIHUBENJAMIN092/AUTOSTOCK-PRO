"use client";

import { ImageIcon } from "lucide-react";

type Category = {
  _id: string;
  name: string;
};

type Props = {
  categories: Category[];
  onSubmit: (e: React.FormEvent) => void;

  code: string;
  setCode: (v: string) => void;

  name: string;
  setName: (v: string) => void;

  description: string;
  setDescription: (v: string) => void;

  price: string;
  setPrice: (v: string) => void;

  stock: string;
  setStock: (v: string) => void;

  category: string;
  setCategory: (v: string) => void;

  image: File | null;
  setImage: (f: File | null) => void;

  error?: string;
};

export default function CreateProductForm({
  categories,
  onSubmit,
  code,
  setCode,
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  stock,
  setStock,
  category,
  setCategory,
  image,
  setImage,
  error,
}: Props) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">
        Agregar Nuevo Producto
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* DATOS */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Código"
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
          className="md:col-span-3 bg-white text-black py-3 rounded font-semibold"
        >
          Agregar Producto
        </button>
      </form>
    </div>
  );
}
