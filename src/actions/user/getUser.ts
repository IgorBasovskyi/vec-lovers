'use server';

import prisma from '@/utils/prisma';
import { createServerError } from '@/utils/general/server';
import { withSession } from '@/utils/auth/withSession';
import { IServerError } from '@/types/general/server';
import { IUser } from '@/types/user/general';

const getUserHandler = async (session: {
  userId: string;
}): Promise<IUser | IServerError> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: String(session.userId) },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      return createServerError('User not found');
    }

    return user;
  } catch (_error) {
    return createServerError();
  }
};

export const getUser = withSession(getUserHandler);
