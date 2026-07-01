import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Message from "@/models/Message";
import RFIDTag from "@/models/RFIDTag";
import StatsCards from "./components/StatsCards";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/");

  await connectDB();

  const [
    totalProducts,
    activeProducts,
    lowStockProducts,
    rfidEnabledProducts,
    totalCategories,
    totalRFIDTags,
    recentProducts,
    lowStockByCategory,
    unreadMessages,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ stock: { $lte: 5 } }),
    Product.countDocuments({ isRFID: true }),
    Category.countDocuments(),
    RFIDTag.countDocuments(),
    Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("category", "name")
      .select("name stock code image")
      .lean(),
    Product.aggregate([
      { $match: { stock: { $lte: 5 } } },
      { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "cat" } },
      { $unwind: { path: "$cat", preserveNullAndEmptyArrays: true } },
      { $group: { _id: "$cat.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Message.countDocuments({ isRead: false }),
  ]);

  return (
    <div className="w-full overflow-x-hidden text-white space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-neutral-400 max-w-2xl">
            Aquí tienes un resumen rápido de tu inventario, etiquetas RFID y categorías.
          </p>
        </div>
        {unreadMessages > 0 && (
          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-500/15 border border-rose-700 px-4 py-2 text-sm text-rose-200 hover:bg-rose-500/25 transition"
          >
            <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
            {unreadMessages} mensaje{unreadMessages !== 1 ? "s" : ""} sin leer
          </Link>
        )}
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
        <div className="p-4 md:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm space-y-4">
          <p className="text-sm uppercase text-neutral-500 tracking-wider">Últimos productos</p>
          {recentProducts.length === 0 ? (
            <p className="text-sm text-neutral-500">No hay productos aún.</p>
          ) : (
            <div className="space-y-2">
              {recentProducts.map((p: any) => (
                <div key={p._id} className="flex items-center gap-3 rounded-2xl bg-neutral-950 border border-neutral-800 px-4 py-3">
                  {p.image && (
                    <img src={p.image} alt="" className="h-8 w-8 rounded-lg object-cover border border-neutral-700" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                    <p className="text-xs text-neutral-500">{p.code}</p>
                  </div>
                  <span className="text-sm text-neutral-400">{p.stock}</span>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/products" className="block text-sm text-cyan-400 hover:text-cyan-300">
            Ver todos los productos →
          </Link>
        </div>

        <div className="p-4 md:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm space-y-4">
          <p className="text-sm uppercase text-neutral-500 tracking-wider">Stock bajo por categoría</p>
          {lowStockByCategory.length === 0 ? (
            <p className="text-sm text-neutral-500">No hay productos con stock bajo.</p>
          ) : (
            <div className="space-y-2">
              {lowStockByCategory.map((c: any) => (
                <div key={c._id || "sin-categoria"} className="flex items-center justify-between rounded-2xl bg-neutral-950 border border-neutral-800 px-4 py-3">
                  <span className="text-sm text-neutral-300">{c._id || "Sin categoría"}</span>
                  <span className="text-sm font-semibold text-rose-400">{c.count} producto{c.count !== 1 ? "s" : ""}</span>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/products?stockMin=1&stockMax=5" className="block text-sm text-cyan-400 hover:text-cyan-300">
            Ver productos con stock bajo →
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="p-4 md:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm space-y-4">
          <div>
            <p className="text-sm uppercase text-neutral-500 tracking-wider">Cuenta</p>
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

        <div className="p-4 md:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm">
          <p className="text-sm uppercase text-neutral-500 tracking-wider mb-4">Accesos rápidos</p>
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
