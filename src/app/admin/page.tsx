import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import RFIDTag from "@/models/RFIDTag";

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-neutral-400 max-w-2xl">
          Aquí tienes un resumen rápido de tu inventario, etiquetas RFID y categorías.
          Usa los accesos directos para navegar rápidamente a la gestión de productos, categorías y RFID.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-950 to-sky-900 border border-sky-700 shadow-sm">
          <p className="text-sm uppercase text-sky-300 tracking-[0.18em]">Productos totales</p>
          <p className="text-4xl font-semibold mt-4 text-white">{totalProducts}</p>
          <p className="text-sm text-sky-200 mt-2">Incluye productos activos e inactivos.</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 to-emerald-900 border border-emerald-700 shadow-sm">
          <p className="text-sm uppercase text-emerald-300 tracking-[0.18em]">Productos activos</p>
          <p className="text-4xl font-semibold mt-4 text-white">{activeProducts}</p>
          <p className="text-sm text-emerald-200 mt-2">Productos disponibles para venta.</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-950 to-violet-900 border border-violet-700 shadow-sm">
          <p className="text-sm uppercase text-violet-300 tracking-[0.18em]">Productos RFID</p>
          <p className="text-4xl font-semibold mt-4 text-white">{rfidEnabledProducts}</p>
          <p className="text-sm text-violet-200 mt-2">Productos con control RFID activado.</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950 to-amber-900 border border-amber-700 shadow-sm">
          <p className="text-sm uppercase text-amber-300 tracking-[0.18em]">Categorías</p>
          <p className="text-4xl font-semibold mt-4 text-white">{totalCategories}</p>
          <p className="text-sm text-amber-200 mt-2">Categorías creadas en el catálogo.</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-fuchsia-950 to-fuchsia-900 border border-fuchsia-700 shadow-sm">
          <p className="text-sm uppercase text-fuchsia-300 tracking-[0.18em]">Etiquetas RFID</p>
          <p className="text-4xl font-semibold mt-4 text-white">{totalRFIDTags}</p>
          <p className="text-sm text-fuchsia-200 mt-2">Tags RFID registrados en el sistema.</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950 to-rose-900 border border-rose-700 shadow-sm">
          <p className="text-sm uppercase text-rose-300 tracking-[0.18em]">Stock bajo</p>
          <p className="text-4xl font-semibold mt-4 text-white">{lowStockProducts}</p>
          <p className="text-sm text-rose-200 mt-2">Productos con stock menor o igual a 5.</p>
        </div>
      </div>

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
