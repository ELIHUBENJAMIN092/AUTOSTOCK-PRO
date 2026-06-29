export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-r from-cyan-500/15 via-sky-500/10 to-violet-500/0 blur-3xl" />
      <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300 mb-4">Gestión inteligente de inventario</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-slate-100 to-violet-300">
              Control Total de Productos RFID
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-10">
              Gestiona tu inventario en tiempo real con información precisa, control de stock y acceso seguro para administradores.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <a
                href="#inventario"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-8 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:opacity-95"
              >
                Ver Inventario
              </a>

              <a
                href="/admin"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-medium text-white transition hover:border-cyan-300/30 hover:bg-white/10"
              >
                Acceso Admin
              </a>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 sm:p-8 lg:p-10 shadow-2xl shadow-slate-950/40">
                <div className="mb-6 rounded-[1.75rem] bg-white p-4 sm:p-6 shadow-2xl shadow-cyan-500/10">
                  <img
                    src="/images/tc22r.png"
                    alt="Zebra TC22R RFID"
                    className="mx-auto max-h-56 sm:max-h-64 lg:max-h-72 object-contain"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-cyan-200 mb-1">+20</div>
                    <p className="text-slate-300 text-xs sm:text-sm">Productos</p>
                  </div>

                  <div className="rounded-3xl border border-sky-500/20 bg-sky-500/10 p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-sky-200 mb-1">Stock</div>
                    <p className="text-slate-300 text-xs sm:text-sm">Vistazo rápido</p>
                  </div>

                  <div className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-violet-200 mb-1">100%</div>
                    <p className="text-slate-300 text-xs sm:text-sm">Precisión</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}