import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const clearedCookie = await clearAdminSession();
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.set(clearedCookie.name, clearedCookie.value, clearedCookie.options);
  return response;
}
