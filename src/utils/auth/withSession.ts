import { verifySession } from './server';
import { redirect } from 'next/navigation';
import { createServerError } from '@/utils/general/server';
import { IServerError } from '@/types/general/server';
import { ISession } from '@/types/auth/server';

type SessionUser = {
  userId: string;
};

type WithSessionOptions = {
  requireUser?: boolean;
};

export function withSession<R>(
  handler: (session: SessionUser) => Promise<R | IServerError>,
  options: WithSessionOptions = {}
): () => Promise<R | IServerError> {
  const { requireUser = true } = options;

  return async (): Promise<R | IServerError> => {
    const session: ISession = await verifySession();

    if (!session.isAuth) {
      redirect('/login');
    }

    if (requireUser && !session.userId) {
      return createServerError('User session invalid');
    }

    return handler({ userId: session.userId! });
  };
}
