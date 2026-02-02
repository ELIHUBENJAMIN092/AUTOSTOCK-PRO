import { useState } from "react";
import type { Category } from "../types";

export function useProductForm(onCreated: () => void) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !price || !category) {
      setError("Nombre, precio y categoría son obligatorios");
      return;
    }

    let imageUrl = "";

    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      imageUrl = uploadData.url;
    }

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        image: imageUrl,
      }),
    });

    setCode("");
    setName("");
    setDescription("");
    setPrice("");
    setStock("0");
    setCategory("");
    setImage(null);

    onCreated();
  };

  return {
    code, setCode,
    name, setName,
    description, setDescription,
    price, setPrice,
    stock, setStock,
    category, setCategory,
    image, setImage,
    error,
    createProduct,
  };
}
