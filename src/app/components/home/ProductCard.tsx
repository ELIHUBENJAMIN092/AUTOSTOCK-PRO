import { Product } from '@/types'
import { Wifi } from "lucide-react"
import Card from '@/app/components/ui/Card'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      {/* IMAGEN */}
      <div className="relative h-56 overflow-hidden bg-white flex items-center justify-center">
        <img
          src={
            product.image ||
            'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400'
          }
          alt={product.name}
          className="w-full h-full object-contain object-center"
        />

        {/* RFID ON */}
        {product.isRFID && (
          <span className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500 text-white">
            <Wifi size={12} />
            RFID ON
          </span>
        )}

        {/* ESTADO */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${
            (product.stock ?? 0) > 10
              ? 'bg-green-600 text-white'
              : (product.stock ?? 0) > 0
              ? 'bg-yellow-500 text-black'
              : 'bg-red-600 text-white'
          }`}
        >
          {(product.stock ?? 0) > 10
            ? 'En Stock'
            : (product.stock ?? 0) > 0
            ? 'Stock Bajo'
            : 'Sin Stock'}
        </span>
      </div>

      {/* CONTENIDO */}
      <div className="bg-neutral-800 p-5 flex-1 flex flex-col">

        {/* CÓDIGO */}
        <span className="text-xs text-neutral-400 tracking-wide">
          {product.code}
        </span>

        {/* NOMBRE */}
        <h3 className="text-white font-semibold mt-1 leading-tight">
          {product.name}
        </h3>

        {/* DESCRIPCIÓN */}
        <p className="text-sm text-neutral-300 mt-2 line-clamp-2">
          {product.description}
        </p>

        {/* STOCK + CATEGORÍA (AL FONDO) */}
        <div className="mt-auto">

          {/* STOCK */}
          <div className="flex items-end gap-2">
            <span className="text-sm text-neutral-400">
              Stock:
            </span>

            <span className="text-2xl font-bold text-white leading-none">
              {product.stock}
            </span>
          </div>

          {/* CATEGORÍA */}
          {typeof product.category !== 'string' && product.category?.name && (
            <div className="mt-2">
              <span
                className="
                  inline-block
                  px-2.5 py-1
                  text-xs font-medium
                  rounded-md
                  bg-white/10
                  text-neutral-200
                  border border-white/10
                "
              >
                {product.category.name}
              </span>
            </div>
          )}

        </div>
      </div>
    </Card>
  )
}
