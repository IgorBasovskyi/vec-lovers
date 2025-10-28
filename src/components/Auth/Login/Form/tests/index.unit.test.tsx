import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import LoginForm from '../index';
import { useServerFormState } from '@/hooks/useServerFormState';
import { useToast } from '@/hooks/useToast';
import { loginAction } from '@/actions/auth/login/login';
import { getFormElements, getFormLabels } from '@/utils/auth/test.helpers';

// ===== Mocks =====
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/actions/auth/login/login', () => ({
  loginAction: vi.fn(),
}));
vi.mock('@/hooks/useServerFormState', () => ({
  useServerFormState: vi.fn(),
}));
vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(),
}));

// ===== Tests =====
describe('LoginForm - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<LoginForm />);

    const { emailInput, passwordInput, submitButton } =
      getFormElements('login');
    const { emailLabel, passwordLabel } = getFormLabels('login');

    // Labels
    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();

    // Inputs
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    // Button
    expect(submitButton).toBeInTheDocument();
  });

  it('has correct input types', () => {
    render(<LoginForm />);

    const { passwordInput } = getFormElements('login');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('calls custom hooks correctly', () => {
    render(<LoginForm />);

    expect(useServerFormState).toHaveBeenCalled();
    expect(useToast).toHaveBeenCalled();
  });

  it('calls loginAction on form submit', async () => {
    (loginAction as Mock).mockResolvedValue(null);

    render(<LoginForm />);

    const { emailInput, passwordInput, submitButton } =
      getFormElements('login');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(loginAction).toHaveBeenCalled();
    });
  });

  it('renders submit button with correct text', () => {
    render(<LoginForm />);

    const { submitButton } = getFormElements('login');
    expect(submitButton).toHaveTextContent('Log In');
  });
});
