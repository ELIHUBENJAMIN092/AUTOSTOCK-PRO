import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true, // ✅ mejora búsquedas por número de parte
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true, // ✅ mejora filtros por categoría
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    minStock: {
      type: Number,
      default: 5,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false, // ✅ evita __v (mejor para APIs)
  }
);

/**
 * 🔒 Protección contra recompilación en Next.js (MUY IMPORTANTE)
 */
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
