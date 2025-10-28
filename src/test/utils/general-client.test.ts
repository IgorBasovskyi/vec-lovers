import { describe, it, expect } from 'vitest';
import { objectToFormData } from '@/utils/general/client';

describe('objectToFormData', () => {
  it('should convert simple object to FormData', () => {
    const obj = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
    };

    const formData = objectToFormData(obj);

    expect(formData.get('name')).toBe('John Doe');
    expect(formData.get('email')).toBe('john@example.com');
    expect(formData.get('age')).toBe('25');
  });

  it('should skip undefined values', () => {
    const obj = {
      name: 'John Doe',
      email: undefined,
      age: 25,
    };

    const formData = objectToFormData(obj);

    expect(formData.get('name')).toBe('John Doe');
    expect(formData.get('email')).toBeNull();
    expect(formData.get('age')).toBe('25');
  });
});
