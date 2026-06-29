"use client";

import { useProducts } from "../hooks/useProducts";
import ProductForm from "../components/ProductForm";
import ScrollToTop from "@/app/components/ScrollToTop";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const router = useRouter();
  const { categories, loading, refreshProducts } = useProducts();

  const handleCreated = () => {
    refreshProducts();
    toast.success("Producto creado exitosamente");
    router.push("/admin/products");
  };

  if (loading) {
    return (
      <div className="w-full px-4 text-neutral-400">
        Cargando formulario...
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden px-4 md:px-6 text-white max-w-5xl mx-auto space-y-8">
      <div className="rounded-[2rem] border border-cyan-700/40 bg-gradient-to-r from-cyan-950 via-slate-950 to-slate-900 p-6 shadow-xl shadow-cyan-500/15">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Administración de productos</p>
            <h1 className="text-3xl font-bold text-white">Crear nuevo producto</h1>
            <p className="max-w-3xl text-neutral-300">
              Añade un producto nuevo al inventario con su información completa y una imagen para facilitar su identificación.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center rounded-2xl bg-neutral-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
          >
            Volver al listado
          </Link>
        </div>
      </div>

      <div className="w-full">
        <ProductForm categories={categories} onCreated={handleCreated} />
      </div>

      <ScrollToTop />
    </div>
  );
}