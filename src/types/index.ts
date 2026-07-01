export type Category = {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export type Product = {
  _id: string;
  code?: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  minStock?: number;
  category?: Category | string;
  image?: string;
  imagePublicId?: string;
  isActive?: boolean;
  isRFID?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type RFIDTag = {
  _id: string;
  epc: string;
  product?: Product | string | null;
  createdAt?: string;
}
