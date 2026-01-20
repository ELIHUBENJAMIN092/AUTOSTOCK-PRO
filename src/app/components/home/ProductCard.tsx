interface ProductCardProps {
  product: any
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition shadow-sm">

      {/* IMAGEN */}
      <div className="relative aspect-square">
        <img
          src={
            product.image ||
            "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"
          }
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* ESTADO */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full text-white ${
            product.stock > 10
              ? 'bg-green-600'
              : product.stock > 0
              ? 'bg-yellow-500 text-black'
              : 'bg-red-600'
          }`}
        >
          {product.stock > 10
            ? 'En Stock'
            : product.stock > 0
            ? 'Stock Bajo'
            : 'Sin Stock'}
        </span>
      </div>

      {/* CONTENIDO */}
      <div className="bg-neutral-800 p-5">

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

        {/* STOCK + CATEGORÍA */}
        <div className="mt-5">

          {/* STOCK EN MISMA FILA */}
          <div className="flex items-end gap-2">
            <span className="text-sm text-neutral-400">
              Stock:
            </span>

            <span className="text-2xl font-bold text-white leading-none">
              {product.stock}
            </span>
          </div>

          {/* CATEGORÍA */}
          {product.category?.name && (
            <div className="mt-2">
              <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-md
                bg-white/10 text-neutral-200 border border-white/10">
                {product.category.name}
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
