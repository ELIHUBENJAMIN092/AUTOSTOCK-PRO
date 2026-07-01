import Navbar from './components/layout/Navbar'
import Hero from './components/home/Hero'
import CategoriesSection from './components/home/CategoriesSection'
import Inventory from './components/home/Inventory'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/ScrollToTop'
import WhatsAppButton from './components/WhatsAppButton'

export default function HomePage() {
  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <Hero />

      {/* CATEGORÍAS */}
      <CategoriesSection />

      {/* INVENTARIO */}
      <Inventory />

      {/* BOTÓN SCROLL */}
      <ScrollToTop />

      {/* WHATSAPP */}
      <WhatsAppButton />

      {/* FOOTER */}
      <Footer />
    </>
  )
}
