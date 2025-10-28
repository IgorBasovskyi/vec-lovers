import type { vi } from 'vitest';

// Mock function types
export type MockHashFunction = ReturnType<typeof vi.fn>;
export type MockCompareFunction = ReturnType<typeof vi.fn>;
export type MockSignJWT = ReturnType<typeof vi.fn>;
export type MockJwtVerify = ReturnType<typeof vi.fn>;
export type MockCookies = ReturnType<typeof vi.fn>;

// Mock interfaces
export interface MockJWTInstance {
  setProtectedHeader: ReturnType<typeof vi.fn>;
  setIssuedAt: ReturnType<typeof vi.fn>;
  setExpirationTime: ReturnType<typeof vi.fn>;
  sign: ReturnType<typeof vi.fn>;
}

export interface MockJwtPayload {
  payload: {
    userId: string;
  };
}

export interface MockCookieStore {
  set: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
}
