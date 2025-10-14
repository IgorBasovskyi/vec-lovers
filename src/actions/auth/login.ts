"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/utils/prisma";
import {
  createServerError,
  createValidationError,
  isValidationError,
} from "@/utils/general/server";
import { verifyPassword } from "@/utils/auth/server";
import { loginSchema } from "@/schemas/userSchema";
import { TState } from "@/types/auth/server";
import { ROUTE } from "@/types/general/client";
import { getFormFields } from "@/utils/general";

type Fields = "email" | "password";

export const loginAction = async (
  _initialState: TState,
  formData: FormData
): Promise<TState> => {
  const { email, password } = getFormFields(formData, ["email", "password"]);

  const maxAge = 60 * 60 * 24 * 7;

  try {
    await loginSchema.validate({ email, password }, { abortEarly: false });
  } catch (error) {
    if (isValidationError(error)) {
      const fields: Partial<Record<Fields, string>> = {};

      for (const item of error.inner) {
        const path = item.path as Fields;
        if (path) fields[path] = item.message;
      }

      return createValidationError(fields);
    }

    return createServerError();
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      return createServerError("Invalid email or password");
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "appSecret"
    );

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: ROUTE.HOME,
      maxAge,
    });

    return { redirectTo: ROUTE.DASHBOARD, type: "success" };
  } catch (err) {
    console.error(err);
    return createServerError();
  }
};
