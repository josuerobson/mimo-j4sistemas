import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "j4sistema-admin-secret-key-change-in-production"
);

const ADMIN_CREDENTIALS = {
  email: "admin@j4sistema.com.br",
  password: "admin123",
};

export interface AuthUser {
  email: string;
  name: string;
  role: string;
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  if (
    email === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  ) {
    const user: AuthUser = {
      email: ADMIN_CREDENTIALS.email,
      name: "Administrador",
      role: "admin",
    };

    const token = await new SignJWT({ ...user })
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

    return { success: true, user };
  }

  return { success: false, error: "Email ou senha inválidos" };
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