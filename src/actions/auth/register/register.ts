'use server';

import prisma from '@/utils/prisma';
import {
  createServerError,
  createValidationError,
  handlePrismaError,
  isValidationError,
} from '@/utils/general/server';
import { TState } from '@/types/general/server';
import { ROUTE } from '@/types/general/client';
import { hashPassword } from '@/utils/auth/server';
import { getFormFields } from '@/utils/general';
import { redirect } from 'next/navigation';
import { registerSchema } from '@/schemas/auth/registerSchema';
import { RegisterFields } from '@/types/auth/server';

export const registerAction = async (
  _initialState: TState,
  formData: FormData
): Promise<TState> => {
  let user;
  const { username, email, password, confirmPassword } = getFormFields(
    formData,
    ['username', 'email', 'password', 'confirmPassword']
  );

  const normalizedEmail = email.trim().toLowerCase();

  try {
    await registerSchema.validate(
      { username, email, password, confirmPassword },
      { abortEarly: false }
    );
  } catch (error) {
    if (isValidationError(error)) {
      const fields = error.inner.reduce(
        (
          acc: Partial<Record<RegisterFields, string>>,
          item: { path?: string; message: string }
        ) => {
          const path = item.path as RegisterFields | undefined;
          if (path) acc[path] = item.message;
          return acc;
        },
        {}
      );

      return createValidationError(fields);
    }

    return createServerError();
  }

  try {
    const hashedPassword = await hashPassword(password);

    user = await prisma.user.create({
      data: {
        username,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });
  } catch (err) {
    return handlePrismaError<RegisterFields>(err, {
      User_email_key: 'email',
      User_username_key: 'username',
    });
  }

  if (user) {
    const params = new URLSearchParams({
      type: 'success',
      message: 'Account created successfully!',
    });
    redirect(`${ROUTE.LOGIN}?${params.toString()}`);
  }

  // This should never be reached due to redirect above, but TypeScript needs it
  return {
    type: 'error',
    message: 'Unexpected error occurred',
  };
};
