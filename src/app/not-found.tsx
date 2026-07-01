import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white px-4">
      <h1 className="text-6xl font-bold text-cyan-400">404</h1>
      <p className="mt-4 text-lg text-neutral-400">Página no encontrada</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
