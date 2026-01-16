import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // 🔒 Si intenta entrar a /admin sin ser admin
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Debe estar logueado
    },
  }
);

// Rutas protegidas
export const config = {
  matcher: ["/admin/:path*"],
};
