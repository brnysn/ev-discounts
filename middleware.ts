import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const LOGO_CACHE = "public, max-age=31536000, immutable"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const path = request.nextUrl.pathname
  if (path.startsWith("/images/chargers/") || path.startsWith("/images/companies/")) {
    response.headers.set("Cache-Control", LOGO_CACHE)
  }
  return response
}

export const config = {
  matcher: ["/images/chargers/:path*", "/images/companies/:path*"],
}
