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
  minStock?: number;

  category?: Category;
  image?: string;

  isActive?: boolean;

  // 🔥 RFID (OFF por defecto en backend)
  isRFID?: boolean;
};
