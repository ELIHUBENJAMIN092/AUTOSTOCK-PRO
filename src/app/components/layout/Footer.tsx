export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-800">
      <div className="container px-4 mx-auto py-12">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">COMPEL</p>
            <h2 className="text-3xl font-semibold text-white">Soluciones RFID y gestión de inventarios</h2>
            <p className="max-w-xl text-slate-400">
              Diseño, implementación y soporte para negocios automotrices con control de stock inteligente y reportes en tiempo real.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-white">Dirección</p>
              <p>Jerónimo Carrión Oe1-10 de Av. 10 de Agosto</p>
              <p>Quito - Ecuador</p>
            </div>
            <div>
              <p className="font-semibold text-white">Teléfono</p>
              <p>(02) 2548-701</p>
              <p>Cell: 098 461 7873</p>
            </div>
            <div>
              <p className="font-semibold text-white">Web</p>
              <a href="https://www.compelecuador.com" target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-cyan-200 transition">
                www.compelecuador.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © 2026 AutoStock Pro. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
