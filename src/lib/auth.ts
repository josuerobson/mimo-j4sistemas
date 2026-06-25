import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "j4sistema-admin-secret-key-change-in-production"
);

export interface AuthUser {
  email: string;
  name: string;
  role: string;
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, error: "Email ou senha inválidos" };
  }

  // Simple password comparison (plain text for now — can be upgraded to bcrypt)
  if (user.password !== password) {
    return { success: false, error: "Email ou senha inválidos" };
  }

  const authUser: AuthUser = {
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = await new SignJWT({ ...authUser })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return { success: true, user: authUser };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-token");
}

export async function verifyAuth(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET_KEY);

    return {
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}