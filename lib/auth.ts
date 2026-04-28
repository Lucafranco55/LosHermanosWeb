import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

const ADMIN_COOKIE_NAME = "los-hermanos-admin-session";

function getAuthSecret() {
  return process.env.AUTH_SECRET || "change-me-in-production";
}

function shouldUseSecureCookies() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  return siteUrl.startsWith("https://");
}

export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.passwordHash);
  return valid ? admin : null;
}

export async function createAdminSession(admin: { id: string; email: string; name: string }) {
  const token = await new SignJWT({
    sub: admin.id,
    email: admin.email,
    name: admin.name
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(new TextEncoder().encode(getAuthSecret()));

  return {
    name: ADMIN_COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: shouldUseSecureCookies(),
      path: "/",
      maxAge: 60 * 60 * 12
    } as const
  };
}

export async function clearAdminSession() {
  return {
    name: ADMIN_COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: shouldUseSecureCookies(),
      path: "/",
      maxAge: 0
    } as const
  };
}

export async function getCurrentAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(getAuthSecret()));
    return {
      id: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name)
    };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
