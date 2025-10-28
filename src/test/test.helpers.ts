import {
  AUTH_INPUT_PLACEHOLDERS,
  AUTH_BUTTON_LABELS,
} from '@/constants/auth/client';
import { screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';

// ---- Types ----
export type FormType = 'register' | 'login';

// ---- Configuration ----
const FORM_CONFIG = {
  register: {
    fields: ['username', 'email', 'password', 'confirmPassword'] as const,
    buttonLabel: AUTH_BUTTON_LABELS.register,
  },
  login: {
    fields: ['email', 'password'] as const,
    buttonLabel: AUTH_BUTTON_LABELS.login,
  },
} as const satisfies Record<
  FormType,
  { fields: readonly string[]; buttonLabel: string }
>;

// ---- Universal selectors ----
export const getFormElements = (type: FormType) => {
  const config = FORM_CONFIG[type];
  if (!config) {
    throw new Error(`Unknown form type: ${type}`);
  }

  const { fields, buttonLabel } = config;
  const elements: Record<string, HTMLInputElement> = {};

  for (const field of fields) {
    elements[`${field}Input`] = screen.getByPlaceholderText(
      AUTH_INPUT_PLACEHOLDERS[field as keyof typeof AUTH_INPUT_PLACEHOLDERS]
    );
  }

  elements.submitButton = screen.getByRole('button', { name: buttonLabel });

  return elements;
};

export const getFormLabels = (type: FormType) => {
  const config = FORM_CONFIG[type];
  if (!config) {
    throw new Error(`Unknown form type: ${type}`);
  }

  const { fields } = config;
  const labels: Record<string, HTMLInputElement> = {};

  for (const field of fields) {
    labels[`${field}Label`] = screen.getByText(
      AUTH_INPUT_PLACEHOLDERS[field as keyof typeof AUTH_INPUT_PLACEHOLDERS]
    );
  }

  return labels;
};

// ---- Validation error checking ----
export const checkValidationError = (errorText: string) =>
  screen.getByText(errorText);

// ---- Заповнення форм ----
export const fillForm = async (
  user: UserEvent,
  type: FormType,
  data: Record<string, string>
): Promise<void> => {
  const elements = getFormElements(type);

  for (const [field, value] of Object.entries(data)) {
    const input = elements[`${field}Input`];
    if (input) await user.type(input, value);
  }
};

export const clearAndFillForm = async (
  user: UserEvent,
  type: FormType,
  data: Record<string, string>
): Promise<void> => {
  const elements = getFormElements(type);

  for (const [field, value] of Object.entries(data)) {
    const input = elements[`${field}Input`];
    if (input) {
      await user.clear(input);
      await user.type(input, value);
    }
  }
};

// ---- Valid data presets ----
export const fillFormWithValidData = async (user: UserEvent): Promise<void> =>
  fillForm(user, 'register', {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  });

export const fillLoginFormWithValidData = async (
  user: UserEvent
): Promise<void> =>
  fillForm(user, 'login', {
    email: 'test@example.com',
    password: 'password123',
  });
