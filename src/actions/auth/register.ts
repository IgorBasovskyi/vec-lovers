"use server";

import prisma from "@/utils/prisma";
import {
  createServerError,
  createValidationError,
  handlePrismaUniqueError,
  isValidationError,
} from "@/utils/general/server";
import { registerSchema } from "@/schemas/userSchema";
import { TState } from "@/types/auth/server";
import { ROUTE } from "@/types/general/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { hashPassword } from "@/utils/auth/server";
import { getFormFields } from "@/utils/general";

type Fields = "username" | "email" | "password" | "confirmPassword";

export const registerAction = async (
  _initialState: TState,
  formData: FormData
): Promise<TState> => {
  const { username, email, password, confirmPassword } = getFormFields(
    formData,
    ["username", "email", "password", "confirmPassword"]
  );

  try {
    await registerSchema.validate(
      { username, email, password, confirmPassword },
      { abortEarly: false }
    );
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
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return createValidationError({
        email: "A user with this email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return {
      redirectTo: ROUTE.LOGIN,
      type: "success",
      message: "Account created successfully!",
    };
  } catch (err) {
    console.error(err);

    if (err instanceof PrismaClientKnownRequestError) {
      return handlePrismaUniqueError<Fields>(err, {
        User_email_key: "email",
        User_username_key: "username",
      });
    }

    return createServerError();
  }
};
