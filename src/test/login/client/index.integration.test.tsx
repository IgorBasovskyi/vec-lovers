import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/Auth/Login/Form';
import {
  checkValidationError,
  clearAndFillForm,
  getFormElements,
} from '@/test/test.helpers';
import { AUTH_VALIDATION_ERRORS } from '@/constants/auth/client';

// -------------------- Test Data --------------------

const DEFAULT_LOGIN_DATA = {
  email: 'test@example.com',
  password: 'password123',
} as const;

const INVALID_EMAIL_DATA = {
  ...DEFAULT_LOGIN_DATA,
  email: 'invalid-email',
} as const;

// Mocks
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/actions/auth/login/login', () => ({
  loginAction: vi.fn(),
}));
vi.mock('@/hooks/useServerFormState', () => ({ useServerFormState: vi.fn() }));
vi.mock('@/hooks/useToast', () => ({ useToast: vi.fn() }));

describe('LoginForm - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles form validation errors', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const { submitButton } = getFormElements('login');

    // Try to submit empty form
    await user.click(submitButton);

    // Check that validation errors are shown
    await waitFor(() => {
      expect(
        checkValidationError(AUTH_VALIDATION_ERRORS.email.required)
      ).toBeInTheDocument();
      expect(
        checkValidationError(AUTH_VALIDATION_ERRORS.password.required)
      ).toBeInTheDocument();
    });
  });

  it('handles email validation', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const { submitButton } = getFormElements('login');

    // Fill form with invalid email
    await clearAndFillForm(user, 'login', INVALID_EMAIL_DATA);

    await user.click(submitButton);

    // Check email validation error
    await waitFor(() => {
      expect(
        checkValidationError(AUTH_VALIDATION_ERRORS.email.invalid)
      ).toBeInTheDocument();
    });
  });

  it('handles empty email validation', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const { submitButton } = getFormElements('login');

    // Just click submit without filling email (it's already empty)
    await user.click(submitButton);

    // Check email required error
    await waitFor(() => {
      expect(
        checkValidationError(AUTH_VALIDATION_ERRORS.email.required)
      ).toBeInTheDocument();
    });
  });

  it('handles empty password validation', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const { submitButton } = getFormElements('login');

    // Just click submit without filling password (it's already empty)
    await user.click(submitButton);

    // Check password required error
    await waitFor(() => {
      expect(
        checkValidationError(AUTH_VALIDATION_ERRORS.password.required)
      ).toBeInTheDocument();
    });
  });

  it('handles valid form submission', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const { submitButton } = getFormElements('login');

    // Fill form with valid data
    await clearAndFillForm(user, 'login', DEFAULT_LOGIN_DATA);

    await user.click(submitButton);

    // Form should submit without validation errors
    // Since the form is valid, no validation error messages should appear
    await waitFor(() => {
      // Check that validation error messages are not present
      expect(
        screen.queryByText(AUTH_VALIDATION_ERRORS.email.required)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(AUTH_VALIDATION_ERRORS.password.required)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(AUTH_VALIDATION_ERRORS.email.invalid)
      ).not.toBeInTheDocument();
    });
  });
});
