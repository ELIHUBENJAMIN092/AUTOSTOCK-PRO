export interface Category {
  _id: string;
  name: string;
  isActive?: boolean;
}

export interface Product {
  _id: string;
  code: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  minStock?: number;
  category?: Category | string;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RFIDTag {
  _id: string;
  epc: string;
  product?: Product | string | null;
  createdAt?: string;
}
