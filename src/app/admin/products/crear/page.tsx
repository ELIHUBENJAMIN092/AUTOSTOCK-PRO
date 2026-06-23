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
    <div className="w-full overflow-x-hidden px-4 md:px-6 text-white max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Crear producto</h1>

        <Link
          href="/admin/products"
          className="bg-neutral-800 border border-neutral-700 text-white px-5 py-3 rounded-lg font-semibold hover:bg-neutral-700 transition"
        >
          Volver
        </Link>
      </div>

      <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6">
        <ProductForm
          categories={categories}
          onCreated={handleCreated}
        />
      </section>

      <ScrollToTop />
    </div>
  );
}