import { Mock } from 'vitest';
import { verifySession } from '@/utils/auth/server';
import {
  MOCK_SESSION,
  MOCK_SESSION_NO_USER,
  MOCK_SESSION_NOT_FOUND,
} from '../testData/session';

export const mockSessionFound = () => {
  (verifySession as unknown as Mock).mockResolvedValue(MOCK_SESSION);
};

export const mockSessionNotFound = () => {
  (verifySession as unknown as Mock).mockResolvedValue(MOCK_SESSION_NOT_FOUND);
};

export const mockSessionNoUserId = () => {
  (verifySession as unknown as Mock).mockResolvedValue(MOCK_SESSION_NO_USER);
};
