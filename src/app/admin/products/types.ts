export type Category = {
  _id: string;
  name: string;
  isActive: boolean;
};

export type Product = {
  _id: string;
  code?: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: Category;
  image?: string;
};
