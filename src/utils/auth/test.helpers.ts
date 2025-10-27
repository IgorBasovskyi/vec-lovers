import {
  AUTH_INPUT_PLACEHOLDERS,
  AUTH_BUTTON_LABELS,
} from '@/constants/auth/client';
import { screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';

// Helper functions for RegisterForm tests only
export const getFormElements = () => ({
  usernameInput: screen.getByPlaceholderText(AUTH_INPUT_PLACEHOLDERS.username),
  emailInput: screen.getByPlaceholderText(AUTH_INPUT_PLACEHOLDERS.email),
  passwordInput: screen.getByPlaceholderText(AUTH_INPUT_PLACEHOLDERS.password),
  confirmPasswordInput: screen.getByPlaceholderText(
    AUTH_INPUT_PLACEHOLDERS.confirmPassword
  ),
  submitButton: screen.getByRole('button', {
    name: AUTH_BUTTON_LABELS.register,
  }),
});

export const getFormLabels = () => ({
  usernameLabel: screen.getByText(AUTH_INPUT_PLACEHOLDERS.username),
  emailLabel: screen.getByText(AUTH_INPUT_PLACEHOLDERS.email),
  passwordLabel: screen.getByText(AUTH_INPUT_PLACEHOLDERS.password),
  confirmPasswordLabel: screen.getByText(
    AUTH_INPUT_PLACEHOLDERS.confirmPassword
  ),
});

export const checkValidationError = (errorText: string) => {
  return screen.getByText(errorText);
};

// Helper to fill form with valid data
export const fillFormWithValidData = async (user: UserEvent): Promise<void> => {
  const { usernameInput, emailInput, passwordInput, confirmPasswordInput } =
    getFormElements();

  await user.type(usernameInput, 'testuser');
  await user.type(emailInput, 'test@example.com');
  await user.type(passwordInput, 'password123');
  await user.type(confirmPasswordInput, 'password123');
};

// Helper to clear and fill form fields
export const clearAndFillForm = async (
  user: UserEvent,
  data: {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }
): Promise<void> => {
  const { usernameInput, emailInput, passwordInput, confirmPasswordInput } =
    getFormElements();

  if (data.username !== undefined) {
    await user.clear(usernameInput);
    await user.type(usernameInput, data.username);
  }
  if (data.email !== undefined) {
    await user.clear(emailInput);
    await user.type(emailInput, data.email);
  }
  if (data.password !== undefined) {
    await user.clear(passwordInput);
    await user.type(passwordInput, data.password);
  }
  if (data.confirmPassword !== undefined) {
    await user.clear(confirmPasswordInput);
    await user.type(confirmPasswordInput, data.confirmPassword);
  }
};
