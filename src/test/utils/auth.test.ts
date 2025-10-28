import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  encrypt,
  decrypt,
  createSession,
  verifySession,
  updateSession,
  deleteSession,
} from '@/utils/auth/server';
import { hash, compare } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type {
  MockHashFunction,
  MockCompareFunction,
  MockSignJWT,
  MockJwtVerify,
  MockCookies,
  MockJWTInstance,
  MockJwtPayload,
  MockCookieStore,
} from '@/types/tests';

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

// Mock jose
vi.mock('jose', () => ({
  SignJWT: vi.fn(),
  jwtVerify: vi.fn(),
}));

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('auth server utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should hash password', async () => {
    const password = 'testpassword123';
    const hashedPassword = 'hashed_password_here';

    (hash as MockHashFunction).mockResolvedValue(hashedPassword);

    const result = await hashPassword(password);

    expect(hash).toHaveBeenCalledWith(password, 12);
    expect(result).toBe(hashedPassword);
  });

  it('should verify password', async () => {
    const password = 'testpassword123';
    const hashedPassword = 'hashed_password_here';

    (compare as MockCompareFunction).mockResolvedValue(true);

    const result = await verifyPassword(password, hashedPassword);

    expect(compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(result).toBe(true);
  });

  it('should encrypt session payload', async () => {
    const payload = { userId: 'user123', expiresAt: new Date() };
    const mockJwt: MockJWTInstance = {
      setProtectedHeader: vi.fn().mockReturnThis(),
      setIssuedAt: vi.fn().mockReturnThis(),
      setExpirationTime: vi.fn().mockReturnThis(),
      sign: vi.fn().mockResolvedValue('encrypted_token'),
    };

    (SignJWT as MockSignJWT).mockReturnValue(mockJwt);

    const result = await encrypt(payload);

    expect(SignJWT).toHaveBeenCalledWith(payload);
    expect(mockJwt.setProtectedHeader).toHaveBeenCalledWith({ alg: 'HS256' });
    expect(mockJwt.setIssuedAt).toHaveBeenCalled();
    expect(mockJwt.setExpirationTime).toHaveBeenCalledWith('1hr');
    expect(mockJwt.sign).toHaveBeenCalled();
    expect(result).toBe('encrypted_token');
  });

  it('should decrypt session token', async () => {
    const token = 'valid_token';
    const mockPayload: MockJwtPayload = { payload: { userId: 'user123' } };

    (jwtVerify as MockJwtVerify).mockResolvedValue(mockPayload);

    const result = await decrypt(token);

    expect(jwtVerify).toHaveBeenCalled();
    expect(result).toEqual(mockPayload.payload);
  });

  it('should create session with user ID', async () => {
    const userId = 'user123';
    const mockCookies: MockCookieStore = {
      set: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
    };

    (cookies as MockCookies).mockReturnValue(mockCookies);

    await createSession(userId);

    expect(mockCookies.set).toHaveBeenCalledWith(
      'session',
      expect.any(String),
      expect.any(Object)
    );
  });

  it('should verify session and return user session', async () => {
    const mockCookies: MockCookieStore = {
      get: vi.fn().mockReturnValue({ value: 'valid_token' }),
      set: vi.fn(),
      delete: vi.fn(),
    };

    (cookies as MockCookies).mockReturnValue(mockCookies);

    const result = await verifySession();

    expect(mockCookies.get).toHaveBeenCalledWith('session');
    expect(result).toEqual({ isAuth: true, userId: 'user123' });
  });

  it('should update session', async () => {
    const mockCookies: MockCookieStore = {
      get: vi.fn().mockReturnValue({ value: 'valid_token' }),
      set: vi.fn(),
      delete: vi.fn(),
    };

    (cookies as MockCookies).mockReturnValue(mockCookies);

    await updateSession();

    expect(mockCookies.get).toHaveBeenCalledWith('session');
    expect(mockCookies.set).toHaveBeenCalled();
  });

  it('should delete session', async () => {
    const mockCookies: MockCookieStore = {
      delete: vi.fn(),
      get: vi.fn(),
      set: vi.fn(),
    };

    (cookies as MockCookies).mockReturnValue(mockCookies);

    await deleteSession();

    expect(mockCookies.delete).toHaveBeenCalledWith('session');
  });
});
