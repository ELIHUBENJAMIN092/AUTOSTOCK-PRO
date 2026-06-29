import Navbar from "@/app/components/layout/Navbar"
import Footer from "@/app/components/layout/Footer"

export const metadata = {
  title: 'Contacto',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="max-w-3xl mx-auto py-16 px-4">
          <h1 className="text-3xl font-semibold mb-4">Contacto</h1>
          <p className="text-neutral-400 mb-6">¿Tienes preguntas? Envíanos un mensaje y te responderemos pronto.</p>

          <form action="#" method="post" className="space-y-6 bg-neutral-900 p-6 rounded-lg border border-neutral-800">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1">Nombre</label>
              <input id="name" name="name" required className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">Correo</label>
              <input id="email" name="email" type="email" required className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-1">Mensaje</label>
              <textarea id="message" name="message" rows={6} required className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <button type="submit" className="inline-flex items-center justify-center px-5 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-500 transition">
                Enviar
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
