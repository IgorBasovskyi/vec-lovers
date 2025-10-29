import { Mock, vi } from 'vitest';
import { getFormFields } from '@/utils/general';
import {
  createSession,
  verifyPassword,
  hashPassword,
} from '@/utils/auth/server';
import prisma from '@/utils/prisma';
import { loginSchema } from '@/schemas/auth/loginSchema';
import { registerSchema } from '@/schemas/auth/registerSchema';
import { isValidationError } from '@/utils/general/server';
import { AUTH_VALIDATION_ERRORS } from '@/constants/auth/client';
import { SERVER_ERRORS } from '@/constants/auth/server';
import { Prisma } from '@prisma/client';
import { MOCK_USER_FULL } from '../testData/auth';

// Form field mocks
export const mockGetFormFields = (fields: Record<string, string>) => {
  (getFormFields as unknown as Mock).mockReturnValue(fields);
};

// Validation mocks
export const createYupValidationError = (
  entries: Array<{ path: string; message: string }>
) => ({ inner: entries });

export const setupLoginValidationFailure = () => {
  const validationError = createYupValidationError([
    { path: 'email', message: AUTH_VALIDATION_ERRORS.email.invalid },
    { path: 'password', message: AUTH_VALIDATION_ERRORS.password.required },
  ]);
  vi.spyOn(loginSchema, 'validate').mockRejectedValue(validationError);
  (isValidationError as unknown as Mock).mockReturnValue(true);
};

export const setupRegistrationValidationFailure = () => {
  const validationError = createYupValidationError([
    { path: 'email', message: AUTH_VALIDATION_ERRORS.email.invalid },
    { path: 'username', message: AUTH_VALIDATION_ERRORS.username.required },
    { path: 'password', message: AUTH_VALIDATION_ERRORS.password.minLength },
    {
      path: 'confirmPassword',
      message: AUTH_VALIDATION_ERRORS.confirmPassword.mismatch,
    },
  ]);
  vi.spyOn(registerSchema, 'validate').mockRejectedValue(validationError);
  (isValidationError as unknown as Mock).mockReturnValue(true);
};

export const setupSuccessfulLoginValidation = (loginData: {
  email: string;
  password: string;
}) => {
  vi.spyOn(loginSchema, 'validate').mockResolvedValue(loginData);
  (isValidationError as unknown as Mock).mockReturnValue(false);
};

export const setupSuccessfulRegistrationValidation = (userData: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  vi.spyOn(registerSchema, 'validate').mockResolvedValue(userData);
  (isValidationError as unknown as Mock).mockReturnValue(false);
};

// User database mocks
export const mockUserFound = (user: typeof MOCK_USER_FULL) => {
  (prisma.user.findFirst as unknown as Mock).mockResolvedValue(user);
};

export const mockUserNotFound = () => {
  (prisma.user.findFirst as unknown as Mock).mockResolvedValue(null);
};

export const mockUserCreation = (userData: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  (prisma.user.create as unknown as Mock).mockResolvedValue({
    id: '2',
    username: userData.username,
    email: userData.email,
    password: 'hashedpassword123',
  });
};

// Auth function mocks
export const mockPasswordVerification = (isValid: boolean) => {
  (verifyPassword as unknown as Mock).mockResolvedValue(isValid);
};

export const mockSessionCreation = () => {
  (createSession as unknown as Mock).mockResolvedValue(undefined);
};

export const mockPasswordHashing = (
  hashedPassword: string = 'hashedpassword123'
) => {
  (hashPassword as unknown as Mock).mockResolvedValue(hashedPassword);
};

// Prisma error mocks
export const mockPrismaUniqueError = (field: string) => {
  const error = new Prisma.PrismaClientKnownRequestError(
    SERVER_ERRORS.uniqueConstraintError,
    {
      code: 'P2002',
      clientVersion: '5.0.0',
      meta: { target: field },
    }
  );
  (prisma.user.create as unknown as Mock).mockRejectedValue(error);
};

export const mockPrismaConnectionError = () => {
  const error = new Prisma.PrismaClientKnownRequestError(
    SERVER_ERRORS.databaseConnectionFailed,
    {
      code: 'P1001',
      clientVersion: '5.0.0',
    }
  );
  (prisma.user.create as unknown as Mock).mockRejectedValue(error);
};

export const mockPrismaGeneralError = () => {
  (prisma.user.create as unknown as Mock).mockRejectedValue(
    new Error('Unexpected error')
  );
};

export const mockUserFindFirstError = () => {
  (prisma.user.findFirst as unknown as Mock).mockRejectedValue(
    new Error(SERVER_ERRORS.databaseConnectionFailed)
  );
};

// Auth error mocks
export const mockPasswordVerificationError = () => {
  (verifyPassword as unknown as Mock).mockRejectedValue(
    new Error(SERVER_ERRORS.passwordVerificationFailed)
  );
};

export const mockSessionCreationError = () => {
  (createSession as unknown as Mock).mockRejectedValue(
    new Error(SERVER_ERRORS.sessionCreationFailed)
  );
};
