const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: ".env.local" });

const User = require("../models/User").default;

async function createAdmin() {
  console.log("🚀 Iniciando creación de admin");

  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI no definida");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Conectado a MongoDB");

  const email = "soporte@compelecuador.com";
  const password = "Compel8794";
  const hashedPassword = await bcrypt.hash(password, 10);

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("⚠️ El usuario admin ya existe");
    process.exit(0);
  }

  await User.create({
    name: "Administrador",
    email,
    password: hashedPassword,
    role: "admin",
    isActive: true,
  });

  console.log("✅ USUARIO ADMIN CREADO");
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
