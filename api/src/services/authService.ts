import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

type Credentials = { email: string; password: string };

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

function signToken(userId: number): string {
  return jwt.sign({ sub: String(userId) }, getJwtSecret(), {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

function httpError(message: string, status: number): Error {
  return Object.assign(new Error(message), { status });
}

export async function register({ email, password }: Credentials) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw httpError("Email already registered", 409);
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  });
  return { user, token: signToken(user.id) };
}

export async function login({ email, password }: Credentials) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw httpError("Invalid credentials", 401);
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw httpError("Invalid credentials", 401);
  return {
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
    token: signToken(user.id),
  };
}
