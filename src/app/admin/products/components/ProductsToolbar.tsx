import SearchBar from "@/app/components/home/SearchBar";
import ProductForm from "./ProductForm";
import type { Category } from "../types";

interface Props {
  categories: Category[];
  search: string;
  setSearch: (v: string) => void;
  form: any;
}

export default function ProductsToolbar({
  categories,
  search,
  setSearch,
  form,
}: Props) {
  return (
    <div className="space-y-6">
      <ProductForm
        categories={categories}
        {...form}
      />
      <SearchBar
        initialValue={search}
        onSearch={setSearch}
        debounceMs={300}
        placeholder="Buscar por nombre o código..."
      />
    </div>
  );
}
