import Navbar from './components/layout/Navbar'
import Hero from './components/home/Hero'
import Inventory from './components/home/Inventory'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/ScrollToTop'

export default function HomePage() {
  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="container px-4 mx-auto">
          <Hero />
        </div>
      </section>

      {/* INVENTARIO */}
      <Inventory />

      {/* BOTÓN SCROLL */}
      <ScrollToTop />

      {/* FOOTER */}
      <Footer />
    </>
  )
}
