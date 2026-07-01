import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";   // ⭐ IMPORTANTE
import { montserrat } from "./fonts";
import { checkEnv } from "@/lib/env-check";
import "./globals.css";

const _envResult = checkEnv();
if (!_envResult.ok) {
  console.error(
    "❌ Variables de entorno faltantes:\n  " + _envResult.missing.join("\n  ")
  );
}

const font = montserrat;

export const metadata: Metadata = {
  title: {
    default: "Autostock Pro — Inventario RFID",
    template: "%s — Autostock Pro",
  },
  description:
    "Sistema de inventario con control RFID. Administra productos, categorías y stock de forma automatizada.",
  keywords: ["inventario", "rfid", "stock", "productos", "autostock"],
  openGraph: {
    title: "Autostock Pro — Inventario RFID",
    description:
      "Sistema de inventario con control RFID. Administra productos, categorías y stock de forma automatizada.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${font.variable} antialiased bg-white text-neutral-900`}
      >

        {/* ✅ ENVOLTORIO CLIENT SAFE */}
        <Providers>
          {children}
        </Providers>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: "#111",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "12px 16px",
            },
          }}
        />

      </body>
    </html>
  );
}
