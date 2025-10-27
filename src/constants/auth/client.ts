import { LoginFormValues, RegisterFormValues } from '@/types/auth/client';

const COMMON_FIELDS = {
  email: '',
  password: '',
};

export const LOGIN_DEFAULT_VALUES: LoginFormValues = {
  ...COMMON_FIELDS,
};

export const REGISTRATION_DEFAULT_VALUES: RegisterFormValues = {
  ...COMMON_FIELDS,
  username: '',
  confirmPassword: '',
};

export const AUTH_INPUT_PLACEHOLDERS = {
  username: 'Username',
  email: 'Email',
  password: 'Password',
  confirmPassword: 'Confirm Password',
};

export const AUTH_FIELDS: RegisterFormValues = {
  username: 'username',
  email: 'email',
  password: 'password',
  confirmPassword: 'confirmPassword',
};

export const AUTH_BUTTON_LABELS = {
  register: 'Register',
  login: 'Login',
};

export const AUTH_VALIDATION_ERRORS = {
  username: {
    minLength: 'Username must be at least 3 characters.',
    maxLength: 'Username should not contain more than 20 characters.',
    required: 'Username is required.',
  },
  email: {
    invalid: 'Invalid email address.',
    required: 'Email is required.',
  },
  password: {
    minLength: 'Password must be at least 8 characters.',
    required: 'Password is required.',
  },
  confirmPassword: {
    mismatch: 'Passwords do not match.',
    required: 'Please confirm your password.',
  },
};
