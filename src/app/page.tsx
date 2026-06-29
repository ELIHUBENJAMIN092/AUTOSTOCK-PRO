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
      <Hero />

      {/* INVENTARIO */}
      <Inventory />

      {/* BOTÓN SCROLL */}
      <ScrollToTop />

      {/* FOOTER */}
      <Footer />
    </>
  )
}
