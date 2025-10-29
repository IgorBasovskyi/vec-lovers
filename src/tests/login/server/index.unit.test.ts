import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import * as general from '@/utils/general/server';
import type { TState } from '@/types/general/server';
import { loginAction } from '@/actions/auth/login/login';
import { ROUTE } from '@/types/general/client';
import { redirect } from 'next/navigation';
import { createSession, verifyPassword } from '@/utils/auth/server';
import { SERVER_ERRORS } from '@/constants/auth/server';

// Test data
import {
  LOGIN_DATA,
  MOCK_USER_FULL,
  VALIDATION_ERRORS,
} from '../../testData/auth';

// Mock helpers
import {
  mockGetFormFields,
  setupLoginValidationFailure,
  setupSuccessfulLoginValidation,
  mockUserFound,
  mockUserNotFound,
  mockPasswordVerification,
  mockSessionCreation,
  mockUserFindFirstError,
  mockPasswordVerificationError,
  mockSessionCreationError,
} from '../../mockHelpers/auth';

// -------------------- Mocks --------------------
vi.mock('@/utils/general/server', () => ({
  createValidationError: vi.fn((fields: Record<string, string>) => ({
    type: 'validation',
    fields,
  })),
  createServerError: vi.fn((message?: string) => ({
    type: 'error',
    message: message || SERVER_ERRORS.serverError,
  })),
  isValidationError: vi.fn(),
}));

vi.mock('@/utils/general', () => ({
  getFormFields: vi.fn(),
}));

vi.mock('@/utils/prisma', () => ({
  default: {
    user: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('@/utils/auth/server', () => ({
  createSession: vi.fn(),
  verifyPassword: vi.fn(),
}));

const mockFormData = new FormData();

// -------------------- Tests --------------------
describe('loginAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return validation errors when inputs are invalid', async () => {
    // Arrange
    mockGetFormFields(LOGIN_DATA.invalid);
    setupLoginValidationFailure();

    // Act
    const result: TState = await loginAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'validation',
      fields: VALIDATION_ERRORS.login,
    });
    expect(general.createValidationError).toHaveBeenCalledWith(
      VALIDATION_ERRORS.login
    );
  });

  it('should return server error when validation fails with non-validation error', async () => {
    // Arrange
    mockGetFormFields(LOGIN_DATA.invalid);
    const { loginSchema } = await import('@/schemas/auth/loginSchema');
    vi.spyOn(loginSchema, 'validate').mockRejectedValue(
      new Error('Schema error')
    );
    (general.isValidationError as unknown as Mock).mockReturnValue(false);

    // Act
    const result: TState = await loginAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'error',
      message: SERVER_ERRORS.serverError,
    });
    expect(general.createServerError).toHaveBeenCalledWith();
  });

  it('should return server error when user is not found', async () => {
    // Arrange
    mockGetFormFields(LOGIN_DATA.nonExistent);
    setupSuccessfulLoginValidation(LOGIN_DATA.nonExistent);
    mockUserNotFound();

    // Act
    const result: TState = await loginAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'error',
      message: SERVER_ERRORS.invalidEmailOrPassword,
    });
    expect(general.createServerError).toHaveBeenCalledWith(
      SERVER_ERRORS.invalidEmailOrPassword
    );
  });

  it('should return server error when password is incorrect', async () => {
    // Arrange
    mockGetFormFields(LOGIN_DATA.wrongPassword);
    setupSuccessfulLoginValidation(LOGIN_DATA.wrongPassword);
    mockUserFound(MOCK_USER_FULL);
    mockPasswordVerification(false);

    // Act
    const result: TState = await loginAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: 'error',
      message: SERVER_ERRORS.invalidEmailOrPassword,
    });
    expect(general.createServerError).toHaveBeenCalledWith(
      SERVER_ERRORS.invalidEmailOrPassword
    );
  });

  it('should successfully login and redirect to dashboard when credentials are valid', async () => {
    // Arrange
    mockGetFormFields(LOGIN_DATA.correctPassword);
    setupSuccessfulLoginValidation(LOGIN_DATA.correctPassword);
    mockUserFound(MOCK_USER_FULL);
    mockPasswordVerification(true);
    mockSessionCreation();

    // Act & Assert
    await expect(loginAction(null, mockFormData)).rejects.toThrow(
      'NEXT_REDIRECT'
    );

    expect(verifyPassword).toHaveBeenCalledWith(
      LOGIN_DATA.correctPassword.password,
      MOCK_USER_FULL.password
    );

    expect(createSession).toHaveBeenCalledWith(MOCK_USER_FULL.id);

    expect(redirect).toHaveBeenCalledWith(ROUTE.DASHBOARD);
  });

  it('should handle case-insensitive email lookup', async () => {
    // Arrange
    mockGetFormFields(LOGIN_DATA.uppercaseEmail);
    setupSuccessfulLoginValidation(LOGIN_DATA.uppercaseEmail);
    mockUserFound(MOCK_USER_FULL);
    mockPasswordVerification(true);
    mockSessionCreation();

    // Act & Assert
    await expect(loginAction(null, mockFormData)).rejects.toThrow(
      'NEXT_REDIRECT'
    );
  });

  it('should throw error when database query fails', async () => {
    // Arrange
    mockGetFormFields(LOGIN_DATA.correctPassword);
    setupSuccessfulLoginValidation(LOGIN_DATA.correctPassword);
    mockUserFindFirstError();

    // Act & Assert
    await expect(loginAction(null, mockFormData)).rejects.toThrow(
      SERVER_ERRORS.databaseConnectionFailed
    );
  });

  it('should throw error when password verification fails with error', async () => {
    // Arrange
    mockGetFormFields(LOGIN_DATA.correctPassword);
    setupSuccessfulLoginValidation(LOGIN_DATA.correctPassword);
    mockUserFound(MOCK_USER_FULL);
    mockPasswordVerificationError();

    // Act & Assert
    await expect(loginAction(null, mockFormData)).rejects.toThrow(
      SERVER_ERRORS.passwordVerificationFailed
    );
  });

  it('should throw error when session creation fails', async () => {
    // Arrange
    mockGetFormFields(LOGIN_DATA.correctPassword);
    setupSuccessfulLoginValidation(LOGIN_DATA.correctPassword);
    mockUserFound(MOCK_USER_FULL);
    mockPasswordVerification(true);
    mockSessionCreationError();

    // Act & Assert
    await expect(loginAction(null, mockFormData)).rejects.toThrow(
      SERVER_ERRORS.sessionCreationFailed
    );
  });
});
