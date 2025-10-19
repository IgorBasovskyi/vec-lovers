"use server";

import prisma from "@/utils/prisma";
import {
  createServerError,
  createValidationError,
  isValidationError,
} from "@/utils/general/server";
import { createSession, verifyPassword } from "@/utils/auth/server";
import { TState } from "@/types/general/server";
import { ROUTE } from "@/types/general/client";
import { getFormFields } from "@/utils/general";
import { redirect } from "next/navigation";
import { loginSchema } from "@/schemas/auth/loginSchema";
import { LoginFields } from "@/types/auth/server";

export const loginAction = async (
  _initialState: TState,
  formData: FormData
): Promise<TState> => {
  const { email, password } = getFormFields(formData, ["email", "password"]);

  try {
    await loginSchema.validate({ email, password }, { abortEarly: false });
  } catch (error) {
    if (isValidationError(error)) {
      const fields: Partial<Record<LoginFields, string>> = {};

      for (const item of error.inner) {
        const path = item.path as LoginFields;
        if (path) fields[path] = item.message;
      }

      return createValidationError(fields);
    }

    return createServerError();
  }

  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase() },
  });

  if (!user || !(await verifyPassword(password, user.password))) {
    return createServerError("Invalid email or password");
  }

  await createSession(user.id);

  redirect(ROUTE.DASHBOARD);
};
