import type { vi } from 'vitest';

// Mock function types
export type MockUseForm = ReturnType<typeof vi.fn>;
export type MockUseTheme = ReturnType<typeof vi.fn>;
export type MockUseRouter = ReturnType<typeof vi.fn>;
export type MockUseSearchParams = ReturnType<typeof vi.fn>;

// Mock interfaces
export interface MockSearchParams {
  get: (key: string) => string | null;
}

export interface MockRouter {
  replace: (url: string) => void;
}

export interface MockUseThemeReturn {
  theme: string | undefined;
  systemTheme: string | undefined;
}

export interface MockFormReturn<T extends Record<string, unknown>> {
  setError: (name: keyof T | 'root', error: { message: string }) => void;
}
