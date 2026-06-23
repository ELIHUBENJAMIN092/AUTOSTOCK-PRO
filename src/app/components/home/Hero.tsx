export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* TEXTO */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight mb-6
              text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
              Control Total de Productos RFID
            </h1>

            <p className="text-neutral-300 text-lg max-w-xl mx-auto lg:mx-0 mb-10">
              Gestiona tu inventario automotriz en tiempo real con información
              precisa, control de stock y acceso seguro para administradores.
            </p>

            <div className="flex justify-center lg:justify-start gap-4">
              <a
                href="#inventario"
                className="px-8 py-3 bg-white text-black rounded-full font-semibold
                hover:bg-neutral-200 transition shadow-lg"
              >
                Ver Inventario
              </a>

              <a
                href="/admin"
                className="px-8 py-3 border border-white/20 text-white rounded-full font-medium
                hover:bg-white/10 transition"
              >
                Acceso Admin
              </a>
            </div>
          </div>

          {/* BLOQUE VISUAL - MÉTRICAS */}
          <div className="w-full lg:w-1/2 hidden lg:block">
            <div className="relative">

              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl blur-2xl" />

              {/* Card */}
              <div className="relative bg-neutral-900 border border-white/10 rounded-3xl p-10 shadow-2xl">

                {/* RFID READER */}
                <div className="mb-8">
                  <div
                    className="
                    bg-white
                   rounded-3xl
                   p-6
                   shadow-2xl
                   flex
                   justify-center
                   items-center
                   "
                  >
                    <img
                      src="/images/tc22r.png"
                      alt="Zebra TC22R RFID"
                      className="max-h-72 object-contain"
                    />
                  </div>
                </div>

                {/* MÉTRICAS */}
                <div className="grid grid-cols-3 gap-6">

                  {/* Productos */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      +20
                    </div>
                    <p className="text-neutral-400 text-sm">
                      Productos
                    </p>
                  </div>

                  {/* Stock */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      Stock
                    </div>
                    <p className="text-neutral-400 text-sm">
                      Vistazo rápido
                    </p>
                  </div>

                  {/* Precisión */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      100%
                    </div>
                    <p className="text-neutral-400 text-sm">
                      Precisión
                    </p>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
