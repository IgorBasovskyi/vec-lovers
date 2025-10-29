import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import RegisterForm from '@/components/Auth/Registration/Form';
import { useServerFormState } from '@/hooks/useServerFormState';
import { useToast } from '@/hooks/useToast';
import { registerAction } from '@/actions/auth/register/register';
import { getFormElements, getFormLabels } from '@/tests/test.helpers';

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

describe('RegisterForm - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<RegisterForm />);

    const {
      usernameInput,
      emailInput,
      passwordInput,
      confirmPasswordInput,
      submitButton,
    } = getFormElements('register');
    const { usernameLabel, emailLabel, passwordLabel, confirmPasswordLabel } =
      getFormLabels('register');

    // Check form labels
    expect(usernameLabel).toBeInTheDocument();
    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
    expect(confirmPasswordLabel).toBeInTheDocument();

    // Check form inputs
    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();

    // Check submit button
    expect(submitButton).toBeInTheDocument();
  });

  it('has correct input types', () => {
    render(<RegisterForm />);

    const { passwordInput, confirmPasswordInput } = getFormElements('register');

    expect(passwordInput.getAttribute('type')).toBe('password');
    expect(confirmPasswordInput.getAttribute('type')).toBe('password');
  });

  it('calls custom hooks correctly', () => {
    render(<RegisterForm />);

    expect(useServerFormState).toHaveBeenCalled();
    expect(useToast).toHaveBeenCalled();
  });

  it('calls registerAction on form submit', async () => {
    (registerAction as Mock).mockResolvedValue(null);

    render(<RegisterForm />);

    const {
      usernameInput,
      emailInput,
      passwordInput,
      confirmPasswordInput,
      submitButton,
    } = getFormElements('register');

    fireEvent.change(usernameInput, {
      target: { value: 'testuser' },
    });
    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(passwordInput, {
      target: { value: 'password123' },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(registerAction).toHaveBeenCalled();
    });
  });
});
