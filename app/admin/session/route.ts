import { NextResponse } from "next/server";
import { createAdminSession, verifyAdminCredentials } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const formData = await request.formData();
  const nextPathValue = formData.get("next");
  const nextPath = typeof nextPathValue === "string" ? nextPathValue : "/admin";
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/admin/login?error=missing", request.url));
  }

  const admin = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url));
  }

  const sessionCookie = await createAdminSession(admin);
  const response = NextResponse.redirect(new URL(nextPath, request.url));
  response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
  return response;
}
