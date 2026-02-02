import SearchBar from "@/app/components/home/SearchBar";
import CreateProductForm from "./CreateProductForm";
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
      <CreateProductForm
        categories={categories}
        {...form}
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nombre o código..."
      />
    </div>
  );
}
