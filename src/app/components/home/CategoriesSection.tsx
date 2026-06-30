"use client";

import { useEffect, useState } from "react";
import { Tags, ChevronDown, ChevronUp } from "lucide-react";

type Category = {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const active = (Array.isArray(data) ? data : []).filter((c: Category) => c.isActive);
        setCategories(active);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (categories.length === 0) return null;

  const visibleCategories = showAll ? categories : categories.slice(0, 6);

  return (
    <section id="categorias" className="bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300 mb-3">
            Categorías
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white">
            Nuestras categorías de productos
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">
            Explora los distintos tipos de productos que gestionamos con tecnología RFID.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCategories.map((cat) => (
            <div
              key={cat._id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-cyan-700/30 hover:shadow-md hover:shadow-cyan-500/5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                  <Tags size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
              </div>
              {cat.description && (
                <p className="text-sm text-slate-400 leading-relaxed">
                  {cat.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {categories.length > 6 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-700/30 bg-cyan-500/10 px-6 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
            >
              {showAll ? (
                <>Ver menos <ChevronUp size={16} /></>
              ) : (
                <>Ver más ({categories.length - 6} restantes) <ChevronDown size={16} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
