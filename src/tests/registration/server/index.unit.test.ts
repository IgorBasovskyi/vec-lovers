import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import * as general from '@/utils/general/server';
import type { TState } from '@/types/general/server';
import { registerAction } from '@/actions/auth/register/register';
import { ROUTE } from '@/types/general/client';
import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import { SERVER_ERRORS } from '@/constants/auth/server';

// Test data
import { REGISTRATION_DATA, VALIDATION_ERRORS } from '../../testData/auth';

// Mock helpers
import {
  mockGetFormFields,
  setupRegistrationValidationFailure,
  setupSuccessfulRegistrationValidation,
  mockUserCreation,
  mockPrismaUniqueError,
  mockPrismaConnectionError,
  mockPrismaGeneralError,
  mockPasswordHashing,
} from '../../mockHelpers/auth';

// -------------------- Mocks --------------------
vi.mock('@/utils/general/server', () => ({
  createValidationError: vi.fn((fields: Record<string, string>) => ({
    type: 'validation',
    fields,
  })),
  createServerError: vi.fn(() => ({
    type: 'error',
    message: SERVER_ERRORS.serverError,
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

// -------------------- Tests --------------------
describe('registerAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return validation errors when inputs are invalid', async () => {
    // Arrange
    mockGetFormFields(REGISTRATION_DATA.invalid);
    setupRegistrationValidationFailure();

    // Act
    const result: TState = await registerAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'validation',
      fields: VALIDATION_ERRORS.registration,
    });
    expect(general.createValidationError).toHaveBeenCalledWith(
      VALIDATION_ERRORS.registration
    );
  });

  it('should return validation error when email already exists (Prisma unique constraint)', async () => {
    // Arrange
    mockGetFormFields(REGISTRATION_DATA.existing);
    setupSuccessfulRegistrationValidation(REGISTRATION_DATA.existing);
    mockPrismaUniqueError('User_email_key');
    (general.handlePrismaError as unknown as Mock).mockReturnValue({
      type: 'validation',
      fields: { email: SERVER_ERRORS.emailAlreadyExists },
    });

    // Act
    const result: TState = await registerAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'validation',
      fields: { email: SERVER_ERRORS.emailAlreadyExists },
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
    mockGetFormFields(REGISTRATION_DATA.existing);
    setupSuccessfulRegistrationValidation(REGISTRATION_DATA.existing);
    mockPrismaUniqueError('User_username_key');
    (general.handlePrismaError as unknown as Mock).mockReturnValue({
      type: 'validation',
      fields: { username: SERVER_ERRORS.usernameAlreadyExists },
    });

    // Act
    const result: TState = await registerAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'validation',
      fields: { username: SERVER_ERRORS.usernameAlreadyExists },
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
    mockGetFormFields(REGISTRATION_DATA.new);
    setupSuccessfulRegistrationValidation(REGISTRATION_DATA.new);
    mockPasswordHashing('hashedpassword123');
    mockUserCreation(REGISTRATION_DATA.new);

    // Act & Assert
    await expect(registerAction(null, mockFormData)).rejects.toThrow(
      'NEXT_REDIRECT'
    );

    const { hashPassword } = await import('@/utils/auth/server');
    expect(hashPassword).toHaveBeenCalledWith(REGISTRATION_DATA.new.password);

    const { default: prisma } = await import('@/utils/prisma');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: REGISTRATION_DATA.new.username,
        email: REGISTRATION_DATA.new.email.toLowerCase(),
        password: 'hashedpassword123',
      },
    });
    expect(redirect).toHaveBeenCalledWith(
      `${ROUTE.LOGIN}?type=success&message=Account+created+successfully%21`
    );
  });

  it('should return server error when Prisma error is not a unique constraint', async () => {
    // Arrange
    mockGetFormFields(REGISTRATION_DATA.new);
    setupSuccessfulRegistrationValidation(REGISTRATION_DATA.new);
    mockPasswordHashing('hashedpassword123');
    mockPrismaConnectionError();
    (general.handlePrismaError as unknown as Mock).mockReturnValue({
      type: 'error',
      message: SERVER_ERRORS.serverError,
    });

    // Act
    const result: TState = await registerAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'error',
      message: SERVER_ERRORS.serverError,
    });
    expect(general.handlePrismaError).toHaveBeenCalledWith(
      expect.any(Prisma.PrismaClientKnownRequestError),
      {
        User_email_key: 'email',
        User_username_key: 'username',
      }
    );
  });

  it('should return server error when non-Prisma error occurs', async () => {
    // Arrange
    mockGetFormFields(REGISTRATION_DATA.new);
    setupSuccessfulRegistrationValidation(REGISTRATION_DATA.new);
    mockPasswordHashing('hashedpassword123');
    mockPrismaGeneralError();
    (general.handlePrismaError as unknown as Mock).mockReturnValue({
      type: 'error',
      message: SERVER_ERRORS.serverError,
    });

    // Act
    const result: TState = await registerAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'error',
      message: SERVER_ERRORS.serverError,
    });
    expect(general.handlePrismaError).toHaveBeenCalledWith(expect.any(Error), {
      User_email_key: 'email',
      User_username_key: 'username',
    });
  });
});
