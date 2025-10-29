// Auth test data constants
import { AUTH_VALIDATION_ERRORS } from '@/constants/auth/client';

export const LOGIN_DATA = {
  valid: {
    email: 'test@example.com',
    password: 'password123',
  },
  invalid: {
    email: 'invalid-email',
    password: '',
  },
  nonExistent: {
    email: 'nonexistent@example.com',
    password: 'password123',
  },
  wrongPassword: {
    email: 'test@example.com',
    password: 'wrongpassword',
  },
  correctPassword: {
    email: 'test@example.com',
    password: 'correctpassword',
  },
  uppercaseEmail: {
    email: 'TEST@EXAMPLE.COM',
    password: 'correctpassword',
  },
} as const;

export const REGISTRATION_DATA = {
  valid: {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  },
  invalid: {
    username: '',
    email: 'invalid',
    password: '123',
    confirmPassword: '321',
  },
  existing: {
    username: 'testuser',
    email: 'existing@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  },
  new: {
    username: 'newuser',
    email: 'new@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  },
} as const;

export const MOCK_USER_FULL = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedpassword123',
} as const;

export const MOCK_USER_PARTIAL = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
} as const;

export const VALIDATION_ERRORS = {
  login: {
    email: AUTH_VALIDATION_ERRORS.email.invalid,
    password: AUTH_VALIDATION_ERRORS.password.required,
  },
  registration: {
    email: AUTH_VALIDATION_ERRORS.email.invalid,
    username: AUTH_VALIDATION_ERRORS.username.required,
    password: AUTH_VALIDATION_ERRORS.password.minLength,
    confirmPassword: AUTH_VALIDATION_ERRORS.confirmPassword.mismatch,
  },
} as const;

export const SERVER_ERROR_RESPONSES = {
  validation: {
    type: 'validation' as const,
    fields: {},
  },
  error: {
    type: 'error' as const,
    message: 'Server error',
  },
  success: {
    type: 'success' as const,
    message: 'Success',
  },
} as const;
