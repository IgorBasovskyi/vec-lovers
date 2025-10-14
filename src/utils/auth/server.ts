import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await compare(password, hashedPassword);
};

export const isAuthenticated = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return false;

  try {
    jwt.verify(token, process.env.JWT_SECRET || "appSecret");
    return true;
  } catch {
    return false;
  }
};
