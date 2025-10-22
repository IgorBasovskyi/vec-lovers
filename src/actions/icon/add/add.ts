'use server';

import prisma from '@/utils/prisma';
import {
  createServerError,
  createSuccessMessage,
  createValidationError,
  handlePrismaError,
  isValidationError,
} from '@/utils/general/server';
import { TState } from '@/types/general/server';
import { getFormFields } from '@/utils/general';
import { addIconSchema } from '@/schemas/addIconSchema';
import { IconFields } from '@/types/icon/server';
import { verifySession } from '@/utils/auth/server';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

export const addIconAction = async (
  _initialState: TState,
  formData: FormData
): Promise<TState> => {
  const session = await verifySession();

  if (!session || !session.userId) {
    redirect('/login');
  }

  const { title, description, svgIcon, category } = getFormFields(formData, [
    'title',
    'description',
    'svgIcon',
    'category',
  ]);

  try {
    await addIconSchema.validate(
      { title, description, svgIcon, category },
      { abortEarly: false }
    );
  } catch (error) {
    if (isValidationError(error)) {
      const fields = error.inner.reduce(
        (
          acc: Partial<Record<IconFields, string>>,
          item: { path?: string; message: string }
        ) => {
          const path = item.path as IconFields | undefined;
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
    await prisma.icon.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        svgIcon: svgIcon.trim(),
        category: category?.trim() || null,
        userId: session.userId,
      },
    });

    // Invalidate the icons cache to show the new icon immediately
    revalidateTag('icons');

    return createSuccessMessage('Icon added successfully!');
  } catch (err) {
    return handlePrismaError<IconFields>(err, {
      Icon_title_key: 'title',
      Icon_svgIcon_key: 'svgIcon',
    });
  }
};
