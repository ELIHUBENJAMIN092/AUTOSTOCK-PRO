"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const handleClick = () => {
    window.open("https://wa.me/593958848792", "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110 hover:shadow-xl active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp size={28} className="text-[#25D366]" />
    </button>
  );
}
