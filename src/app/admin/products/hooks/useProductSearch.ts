import { useState, useMemo } from "react";
import type { Product } from "../types";

export function useProductSearch(products: Product[]) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.code ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return {
    search,
    setSearch,
    filteredProducts,
  };
}
