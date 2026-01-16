import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

  // ✅ Admin autorizado
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Panel de Administración
      </h1>

      <p className="text-neutral-400">
        Bienvenido al sistema AutoStock
      </p>

      <div className="mt-6 p-4 rounded-lg bg-neutral-900 border border-neutral-800">
        <p className="text-sm text-neutral-400">Usuario:</p>
        <p className="font-medium">{session.user.email}</p>

        <p className="text-sm text-neutral-400 mt-2">Rol:</p>
        <p className="font-medium text-green-400">
          {session.user.role}
        </p>
      </div>
    </div>
  );
}
