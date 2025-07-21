/* eslint-disable @typescript-eslint/no-unused-vars */
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Você pode adicionar lógica extra aqui, se quiser
    return NextResponse.next()
  },
  {
    pages: {
      signIn: "/",
    },
  }
)

export const config = {
  matcher: [
    "/(auth)/:path*",
    "/reservation/:path*",
    "/clients/:path*",
    "/rooms/:path*",
    "/logs/:path*",
    "/profile/:path*",
  ],
}
