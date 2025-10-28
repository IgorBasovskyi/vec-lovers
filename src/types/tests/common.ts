import type { vi } from 'vitest';

// Common mock function types
export type MockFunction = ReturnType<typeof vi.fn>;

// Common mock interfaces
export interface MockValidationError {
  message: string;
  path: string[];
}

// Test data interfaces
export interface TestUser {
  id: string;
  username: string;
  email: string;
}

export interface TestFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
