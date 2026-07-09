import { NextResponse, type NextRequest } from "next/server";
import { sessionCookieName } from "@/lib/auth/cookies";
import { applyRateLimit } from "@/lib/rate-limit/middleware";
import { securityHeaders } from "@/lib/security/headers";

const protectedRoutes = ["/home", "/profile", "/orders", "/wishlist", "/cart", "/checkout", "/fit-match", "/engagement", "/reviews", "/rewards", "/referrals", "/notifications", "/admin"];
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
const mutatingMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function withSecurityHeaders(response: NextResponse, extraHeaders?: Record<string, string>) {
  const headers: Record<string, string> = { ...securityHeaders(), ...extraHeaders };
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

function isSameOriginMutation(request: NextRequest) {
  if (!mutatingMethods.has(request.method)) return true;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === request.nextUrl.origin;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(sessionCookieName)?.value);
  const rateLimit = await applyRateLimit(request);

  if (!isSameOriginMutation(request)) {
    return withSecurityHeaders(NextResponse.json({ message: "Invalid request origin." }, { status: 403 }));
  }

  if (rateLimit && !rateLimit.result.success) {
    return withSecurityHeaders(
      NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 },
      ),
      {
        "RateLimit-Limit": String(rateLimit.result.limit),
        "RateLimit-Remaining": String(rateLimit.result.remaining),
        "RateLimit-Reset": String(Math.ceil(rateLimit.result.resetAt / 1000)),
      },
    );
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return withSecurityHeaders(NextResponse.redirect(url));
  }

  if (authRoutes.some((route) => pathname.startsWith(route)) && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return withSecurityHeaders(NextResponse.redirect(url));
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.svg).*)"],
};
