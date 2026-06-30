import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import RFIDTag from "@/models/RFIDTag";
import StatsCards from "./components/StatsCards";

export default async function AdminPage() {
  // Obtener sesión en el servidor
  const session = await getServerSession(authOptions);

  // 🔒 Si no está logueado → login
  if (!session) {
    redirect("/login");
  }

  // 🔒 Si no es admin → home
  if (session.user.role !== "admin") {
    redirect("/");
  }

  await connectDB();

  const [
    totalProducts,
    activeProducts,
    lowStockProducts,
    rfidEnabledProducts,
    totalCategories,
    totalRFIDTags,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ stock: { $lte: 5 } }),
    Product.countDocuments({ isRFID: true }),
    Category.countDocuments(),
    RFIDTag.countDocuments(),
  ]);

  return (
    <div className="w-full overflow-x-hidden px-4 md:px-6 text-white max-w-screen-xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-neutral-400 max-w-2xl">
          Aquí tienes un resumen rápido de tu inventario, etiquetas RFID y categorías.
          Usa los accesos directos para navegar rápidamente a la gestión de productos, categorías y RFID.
        </p>
      </div>

      <StatsCards
        totalProducts={totalProducts}
        activeProducts={activeProducts}
        rfidEnabledProducts={rfidEnabledProducts}
        totalCategories={totalCategories}
        totalRFIDTags={totalRFIDTags}
        lowStockProducts={lowStockProducts}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm space-y-4">
          <div>
            <p className="text-sm uppercase text-neutral-500 tracking-[0.18em]">Cuenta</p>
            <p className="mt-3 text-white text-lg font-semibold">{session.user.email}</p>
            <p className="text-sm text-neutral-400">Rol: <span className="text-green-400">{session.user.role}</span></p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-neutral-950 p-4 border border-neutral-800">
              <p className="text-xs uppercase text-neutral-500">Productos activos</p>
              <p className="mt-2 text-xl font-semibold">{activeProducts}</p>
            </div>
            <div className="rounded-2xl bg-neutral-950 p-4 border border-neutral-800">
              <p className="text-xs uppercase text-neutral-500">Etiquetas RFID</p>
              <p className="mt-2 text-xl font-semibold">{totalRFIDTags}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm">
          <p className="text-sm uppercase text-neutral-500 tracking-[0.18em] mb-4">Accesos rápidos</p>
          <div className="grid gap-3">
            <a
              href="/admin/products"
              className="block rounded-2xl bg-neutral-950 border border-neutral-800 px-4 py-4 hover:border-neutral-600 transition"
            >
              Ver y editar productos
            </a>
            <a
              href="/admin/rfid"
              className="block rounded-2xl bg-neutral-950 border border-neutral-800 px-4 py-4 hover:border-neutral-600 transition"
            >
              Gestionar RFID y etiquetas
            </a>
            <a
              href="/admin/categories"
              className="block rounded-2xl bg-neutral-950 border border-neutral-800 px-4 py-4 hover:border-neutral-600 transition"
            >
              Administrar categorías
            </a>
            <a
              href="/"
              className="block rounded-2xl bg-neutral-950 border border-neutral-800 px-4 py-4 hover:border-neutral-600 transition"
            >
              Volver al home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
