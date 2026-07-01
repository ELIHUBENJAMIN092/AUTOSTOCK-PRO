'use client'

import { useState, useEffect } from 'react'

interface SearchBarProps {
  initialValue?: string
  onSearch: (value: string) => void
  debounceMs?: number
  placeholder?: string
}

export default function SearchBar({
  initialValue = '',
  onSearch,
  debounceMs = 300,
  placeholder = 'Buscar por nombre, número de parte o EPC...'
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const t = setTimeout(() => onSearch(value.trim()), debounceMs)
    return () => clearTimeout(t)
  }, [value, debounceMs, onSearch])

  return (
    <div className="w-full mb-6 relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
      </span>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-10 py-3 rounded-lg
          bg-neutral-800 border border-neutral-700 text-white
          focus:outline-none focus:border-neutral-500"
      />

      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2
            text-white/70 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
