import { describe, it, expect } from 'vitest';
import {
  createSuccessMessage,
  createServerError,
  isValidationError,
  createValidationError,
  handlePrismaError,
} from '@/utils/general/server';
import { getFormFields } from '@/utils/general';
import { ValidationError } from 'yup';

describe('general server helpers', () => {
  it('should create success message with default text', () => {
    const result = createSuccessMessage();

    expect(result).toEqual({
      message: 'Success',
      type: 'success',
    });
  });

  it('should create server error with custom message', () => {
    const customMessage = 'Database connection failed';
    const result = createServerError(customMessage);

    expect(result).toEqual({
      message: customMessage,
      type: 'error',
    });
  });

  it('should identify validation errors correctly', () => {
    const validationError = new ValidationError('Validation failed');

    const result = isValidationError(validationError);

    expect(result).toBe(true);
  });

  it('should return false for non-validation errors', () => {
    const regularError = new Error('Regular error');

    const result = isValidationError(regularError);

    expect(result).toBe(false);
  });

  it('should create validation error with fields', () => {
    const fields = {
      email: 'Email is required',
      password: 'Password must be at least 8 characters',
    };

    const result = createValidationError(fields);

    expect(result).toEqual({
      type: 'validation',
      fields,
    });
  });

  it('should handle non-Prisma errors', () => {
    const regularError = new Error('Regular error');

    const result = handlePrismaError(regularError);

    expect(result).toEqual({
      message: 'Server error. Please try again later.',
      type: 'error',
    });
  });

  it('should extract form fields from FormData', () => {
    const formData = new FormData();
    formData.append('username', 'testuser');
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    const fields = ['username', 'email', 'password'];
    const result = getFormFields(formData, fields);

    expect(result).toEqual({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should handle empty FormData', () => {
    const formData = new FormData();
    const fields = ['username', 'email'];

    const result = getFormFields(formData, fields);

    expect(result).toEqual({
      username: '',
      email: '',
    });
  });
});
