import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Credenciales incompletas");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Usuario no encontrado");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error("Contraseña incorrecta");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email.split("@")[0],
          role: user.role as "admin" | "user",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as "admin" | "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "admin" | "user";
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
