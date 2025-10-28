import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import * as general from '@/utils/general/server';
import { getFormFields } from '@/utils/general';
import type { TState } from '@/types/general/server';
import { IValidationError } from '@/types/general/server';
import { registerAction } from '@/actions/auth/register/register';
import prisma from '@/utils/prisma';
import { ROUTE } from '@/types/general/client';
import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import { registerSchema } from '@/schemas/auth/registerSchema';
import { AUTH_VALIDATION_ERRORS } from '@/constants/auth/client';
import { AUTH_SERVER_ERRORS } from '@/constants/auth/server';

// -------------------- Test Data --------------------
const DEFAULT_USER_DATA = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123',
} as const;

const INVALID_USER_DATA = {
  username: '',
  email: 'invalid',
  password: '123',
  confirmPassword: '321',
} as const;

const EXISTING_USER_DATA = {
  ...DEFAULT_USER_DATA,
  email: 'existing@example.com',
} as const;

const NEW_USER_DATA = {
  ...DEFAULT_USER_DATA,
  email: 'new@example.com',
} as const;

// -------------------- Mocks --------------------
vi.mock('@/utils/general/server', () => ({
  createValidationError: vi.fn(
    (fields: Record<string, string>): IValidationError => ({
      type: 'validation',
      fields,
    })
  ),
  createServerError: vi.fn(() => ({
    type: 'error',
    message: AUTH_SERVER_ERRORS.serverError,
  })),
  isValidationError: vi.fn(),
  handlePrismaError: vi.fn(),
}));

vi.mock('@/utils/general', () => ({
  getFormFields: vi.fn(),
}));

vi.mock('@/utils/prisma', () => ({
  default: {
    user: {
      create: vi.fn(),
    },
  },
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('@/utils/auth/server', () => ({
  hashPassword: vi.fn(),
}));

const mockFormData = new FormData();

// -------------------- Test Helpers --------------------
const mockGetFormFields = (fields: Record<string, string>) => {
  (getFormFields as unknown as Mock).mockReturnValue(fields);
};

const createYupValidationError = (
  entries: Array<{ path: string; message: string }>
) => ({ inner: entries });

const setupValidationFailure = () => {
  const validationError = createYupValidationError([
    { path: 'email', message: AUTH_VALIDATION_ERRORS.email.invalid },
    { path: 'username', message: AUTH_VALIDATION_ERRORS.username.required },
    {
      path: 'password',
      message: AUTH_VALIDATION_ERRORS.password.minLength,
    },
    {
      path: 'confirmPassword',
      message: AUTH_VALIDATION_ERRORS.confirmPassword.mismatch,
    },
  ]);
  vi.spyOn(registerSchema, 'validate').mockRejectedValue(validationError);
  (general.isValidationError as unknown as Mock).mockReturnValue(true);
};

const setupSuccessfulValidation = (userData: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  vi.spyOn(registerSchema, 'validate').mockResolvedValue(userData);
  (general.isValidationError as unknown as Mock).mockReturnValue(false);
};

const mockUserCreation = (userData: {
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

const mockPrismaUniqueError = (field: string) => {
  const error = new Prisma.PrismaClientKnownRequestError(
    AUTH_SERVER_ERRORS.uniqueConstraintError,
    {
      code: 'P2002',
      clientVersion: '5.0.0',
      meta: { target: field },
    }
  );
  (prisma.user.create as unknown as Mock).mockRejectedValue(error);
};

// -------------------- Tests --------------------
describe('registerAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return validation errors when inputs are invalid', async () => {
    // Arrange
    mockGetFormFields(INVALID_USER_DATA);
    setupValidationFailure();

    // Act
    const result: TState = await registerAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'validation',
      fields: {
        email: AUTH_VALIDATION_ERRORS.email.invalid,
        username: AUTH_VALIDATION_ERRORS.username.required,
        password: AUTH_VALIDATION_ERRORS.password.minLength,
        confirmPassword: AUTH_VALIDATION_ERRORS.confirmPassword.mismatch,
      },
    });
    expect(general.createValidationError).toHaveBeenCalledWith({
      email: AUTH_VALIDATION_ERRORS.email.invalid,
      username: AUTH_VALIDATION_ERRORS.username.required,
      password: AUTH_VALIDATION_ERRORS.password.minLength,
      confirmPassword: AUTH_VALIDATION_ERRORS.confirmPassword.mismatch,
    });
  });

  it('should return validation error when email already exists (Prisma unique constraint)', async () => {
    // Arrange
    mockGetFormFields(EXISTING_USER_DATA);
    setupSuccessfulValidation(EXISTING_USER_DATA);
    mockPrismaUniqueError('User_email_key');
    (general.handlePrismaError as unknown as Mock).mockReturnValue({
      type: 'validation',
      fields: { email: AUTH_SERVER_ERRORS.emailAlreadyExists },
    });

    // Act
    const result: TState = await registerAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'validation',
      fields: { email: AUTH_SERVER_ERRORS.emailAlreadyExists },
    });
    expect(general.handlePrismaError).toHaveBeenCalledWith(
      expect.any(Prisma.PrismaClientKnownRequestError),
      {
        User_email_key: 'email',
        User_username_key: 'username',
      }
    );
  });

  it('should return validation error when username already exists (Prisma unique constraint)', async () => {
    // Arrange
    mockGetFormFields(EXISTING_USER_DATA);
    setupSuccessfulValidation(EXISTING_USER_DATA);
    mockPrismaUniqueError('User_username_key');
    (general.handlePrismaError as unknown as Mock).mockReturnValue({
      type: 'validation',
      fields: { username: AUTH_SERVER_ERRORS.usernameAlreadyExists },
    });

    // Act
    const result: TState = await registerAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'validation',
      fields: { username: AUTH_SERVER_ERRORS.usernameAlreadyExists },
    });
    expect(general.handlePrismaError).toHaveBeenCalledWith(
      expect.any(Prisma.PrismaClientKnownRequestError),
      {
        User_email_key: 'email',
        User_username_key: 'username',
      }
    );
  });

  it('should successfully create user and redirect to login when all conditions are met', async () => {
    // Arrange
    mockGetFormFields(NEW_USER_DATA);
    setupSuccessfulValidation(NEW_USER_DATA);

    const { hashPassword } = await import('@/utils/auth/server');
    (hashPassword as unknown as Mock).mockResolvedValue('hashedpassword123');
    mockUserCreation(NEW_USER_DATA);

    // Act & Assert
    await expect(registerAction(null, mockFormData)).rejects.toThrow(
      'NEXT_REDIRECT'
    );

    expect(hashPassword).toHaveBeenCalledWith(NEW_USER_DATA.password);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: NEW_USER_DATA.username,
        email: NEW_USER_DATA.email.toLowerCase(),
        password: 'hashedpassword123',
      },
    });
    expect(redirect).toHaveBeenCalledWith(
      `${ROUTE.LOGIN}?type=success&message=Account+created+successfully%21`
    );
  });

  it('should return server error when Prisma error is not a unique constraint', async () => {
    // Arrange
    mockGetFormFields(NEW_USER_DATA);
    setupSuccessfulValidation(NEW_USER_DATA);

    const { hashPassword } = await import('@/utils/auth/server');
    (hashPassword as unknown as Mock).mockResolvedValue('hashedpassword123');

    const prismaError = new Prisma.PrismaClientKnownRequestError(
      AUTH_SERVER_ERRORS.databaseConnectionFailed,
      {
        code: 'P1001',
        clientVersion: '5.0.0',
      }
    );
    (prisma.user.create as unknown as Mock).mockRejectedValue(prismaError);
    (general.handlePrismaError as unknown as Mock).mockReturnValue({
      type: 'error',
      message: AUTH_SERVER_ERRORS.serverError,
    });

    // Act
    const result: TState = await registerAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'error',
      message: AUTH_SERVER_ERRORS.serverError,
    });
    expect(general.handlePrismaError).toHaveBeenCalledWith(prismaError, {
      User_email_key: 'email',
      User_username_key: 'username',
    });
  });

  it('should return server error when non-Prisma error occurs', async () => {
    // Arrange
    mockGetFormFields(NEW_USER_DATA);
    setupSuccessfulValidation(NEW_USER_DATA);

    const { hashPassword } = await import('@/utils/auth/server');
    (hashPassword as unknown as Mock).mockResolvedValue('hashedpassword123');

    (prisma.user.create as unknown as Mock).mockRejectedValue(
      new Error('Unexpected error')
    );
    (general.handlePrismaError as unknown as Mock).mockReturnValue({
      type: 'error',
      message: AUTH_SERVER_ERRORS.serverError,
    });

    // Act
    const result: TState = await registerAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'error',
      message: AUTH_SERVER_ERRORS.serverError,
    });
    expect(general.handlePrismaError).toHaveBeenCalledWith(expect.any(Error), {
      User_email_key: 'email',
      User_username_key: 'username',
    });
  });
});
