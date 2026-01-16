import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI no está definida");
}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Error conectando MongoDB", error);
    throw error;
  }
};
