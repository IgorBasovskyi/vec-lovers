import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '@/components/Auth/Registration/Form';
import {
  getFormElements,
  checkValidationError,
  clearAndFillForm,
} from '@/utils/auth/test.helpers';
import { AUTH_VALIDATION_ERRORS } from '@/constants/auth/client';

// -------------------- Test Data --------------------

const DEFAULT_USER_DATA = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123',
} as const;

const MISMATCHED_PASSWORD_DATA = {
  ...DEFAULT_USER_DATA,
  confirmPassword: 'different123',
} as const;

const INVALID_EMAIL_DATA = {
  ...DEFAULT_USER_DATA,
  email: 'invalid-email',
} as const;

const INVALID_USERNAME_DATA = {
  ...DEFAULT_USER_DATA,
  username: 'ab',
} as const;

const INVALID_PASSWORD_DATA = {
  ...DEFAULT_USER_DATA,
  password: '123',
} as const;

// Mocks
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/actions/auth/register/register', () => ({
  registerAction: vi.fn(),
}));
vi.mock('@/hooks/useServerFormState', () => ({ useServerFormState: vi.fn() }));
vi.mock('@/hooks/useToast', () => ({ useToast: vi.fn() }));

describe('RegisterForm - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles form validation errors', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const { submitButton } = getFormElements();

    // Try to submit empty form
    await user.click(submitButton);

    // Check that validation errors are shown
    await waitFor(() => {
      expect(
        checkValidationError(AUTH_VALIDATION_ERRORS.username.minLength)
      ).toBeInTheDocument();
      expect(
        checkValidationError(AUTH_VALIDATION_ERRORS.email.required)
      ).toBeInTheDocument();
      expect(
        checkValidationError(AUTH_VALIDATION_ERRORS.password.minLength)
      ).toBeInTheDocument();
      expect(
        checkValidationError(AUTH_VALIDATION_ERRORS.confirmPassword.required)
      ).toBeInTheDocument();
    });
  });

  it('handles password mismatch validation', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const { submitButton } = getFormElements();

    // Fill form with mismatched passwords
    await clearAndFillForm(user, MISMATCHED_PASSWORD_DATA);

    await user.click(submitButton);

    // Check password mismatch error
    await waitFor(() => {
      expect(
        checkValidationError(AUTH_VALIDATION_ERRORS.confirmPassword.mismatch)
      ).toBeInTheDocument();
    });
  });

  it('handles email validation', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const { submitButton } = getFormElements();

    // Fill form with invalid email
    await clearAndFillForm(user, INVALID_EMAIL_DATA);

    await user.click(submitButton);

    // Check email validation error
    await waitFor(() => {
      expect(
        checkValidationError(AUTH_VALIDATION_ERRORS.email.invalid)
      ).toBeInTheDocument();
    });
  });

  it('handles username length validation', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const { submitButton } = getFormElements();

    // Fill form with username too short
    await clearAndFillForm(user, INVALID_USERNAME_DATA);

    await user.click(submitButton);

    // Check username length error
    await waitFor(() => {
      expect(
        checkValidationError(AUTH_VALIDATION_ERRORS.username.minLength)
      ).toBeInTheDocument();
    });
  });

  it('handles password length validation', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const { submitButton } = getFormElements();

    // Fill form with password too short
    await clearAndFillForm(user, INVALID_PASSWORD_DATA);

    await user.click(submitButton);

    // Check password length error
    await waitFor(() => {
      expect(
        checkValidationError(AUTH_VALIDATION_ERRORS.password.minLength)
      ).toBeInTheDocument();
    });
  });
});
