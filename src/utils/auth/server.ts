import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { ROUTE } from "@/types/general/client";
import { COOKIE_NAME } from "@/constants/general";
import { ISession, SessionPayload } from "@/types/auth/server";

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

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

export const encrypt = (payload: SessionPayload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1hr")
    .sign(key);
};

export const decrypt = async (session: string | undefined = "") => {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (_error) {
    return null;
  }
};

export const createSession = async (userId: string) => {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  (await cookies()).set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: ROUTE.HOME,
  });
};

export const verifySession = async (): Promise<ISession> => {
  const cookie = (await cookies()).get("session")?.value;
  const session = cookie
    ? ((await decrypt(cookie)) as SessionPayload | null)
    : null;

  return {
    isAuth: !!session?.userId,
    userId: session?.userId,
  };
};

export const updateSession = async () => {
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  (await cookies()).set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: ROUTE.HOME,
  });
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect(ROUTE.HOME);
};
