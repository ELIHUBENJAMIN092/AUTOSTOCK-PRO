'use client'

interface CategoryFilterProps {
  categories: { _id: string; name: string }[]
  value: string
  onChange: (category: string) => void
  allLabel?: string
}

export default function CategoryFilter({
  categories,
  value,
  onChange,
  allLabel = 'Todas'
}: CategoryFilterProps) {
  if (categories.length === 0) return null

  return (
    <div className="max-w-6xl mx-auto mb-12">
      <div
        className="
          flex gap-3 pb-2
          overflow-x-auto flex-nowrap
          scrollbar-hide

          md:overflow-visible
          md:flex-wrap
          md:justify-center
        "
      >
        {/* TODAS */}
        <button
          onClick={() => onChange('all')}
          className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
            ${value === 'all'
              ? 'bg-white text-black'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
        >
          {allLabel}
        </button>

        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => onChange(cat._id)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
              ${value === cat._id
                ? 'bg-white text-black'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
