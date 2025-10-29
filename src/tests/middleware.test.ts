import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import middleware from '@/middleware';
import { ROUTE } from '@/types/general/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/utils/auth/server';

// -------------------- Mocks --------------------
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('@/utils/auth/server', () => ({
  decrypt: vi.fn(),
}));

// We will spy on NextResponse methods rather than fully mocking the module

// -------------------- Test Helpers --------------------
const createRequest = (path: string) => {
  // Minimal shape needed by our middleware implementation
  return {
    nextUrl: new URL(`http://localhost${path}`),
  } as unknown as Parameters<typeof middleware>[0];
};

const mockCookie = (value?: string) => {
  (cookies as unknown as Mock).mockResolvedValue({
    get: vi.fn().mockReturnValue(value ? { value } : undefined),
  });
};

const mockDecrypt = (payload: { userId?: string } | null) => {
  (decrypt as unknown as Mock).mockResolvedValue(payload);
};

// -------------------- Tests --------------------
describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login when visiting a protected route without a session', async () => {
    // Arrange
    const req = createRequest(ROUTE.DASHBOARD);
    mockCookie(undefined);
    mockDecrypt(null);

    const redirectSpy = vi
      .spyOn(NextResponse, 'redirect')
      .mockReturnValue({} as unknown as NextResponse);

    // Act
    await middleware(req);

    // Assert
    expect(redirectSpy).toHaveBeenCalledWith(new URL(ROUTE.LOGIN, req.nextUrl));
  });

  it('redirects to dashboard when visiting a public route with an active session', async () => {
    // Arrange
    const req = createRequest(ROUTE.LOGIN);
    mockCookie('valid');
    mockDecrypt({ userId: 'u1' });

    const redirectSpy = vi
      .spyOn(NextResponse, 'redirect')
      .mockReturnValue({} as unknown as NextResponse);

    // Act
    await middleware(req);

    // Assert
    expect(redirectSpy).toHaveBeenCalledWith(
      new URL(ROUTE.DASHBOARD, req.nextUrl)
    );
  });

  it('passes through when visiting a protected route with an active session', async () => {
    // Arrange
    const req = createRequest(ROUTE.DASHBOARD);
    mockCookie('valid');
    mockDecrypt({ userId: 'u1' });

    const nextSpy = vi
      .spyOn(NextResponse, 'next')
      .mockReturnValue({} as unknown as NextResponse);

    // Act
    await middleware(req);

    // Assert
    expect(nextSpy).toHaveBeenCalled();
  });

  it('passes through when visiting a public route without a session', async () => {
    // Arrange
    const req = createRequest(ROUTE.HOME);
    mockCookie(undefined);
    mockDecrypt(null);

    const nextSpy = vi
      .spyOn(NextResponse, 'next')
      .mockReturnValue({} as unknown as NextResponse);

    // Act
    await middleware(req);

    // Assert
    expect(nextSpy).toHaveBeenCalled();
  });

  it('does not redirect from dashboard to dashboard (already there)', async () => {
    // Arrange
    const req = createRequest(ROUTE.DASHBOARD);
    mockCookie('valid');
    mockDecrypt({ userId: 'u1' });

    const redirectSpy = vi
      .spyOn(NextResponse, 'redirect')
      .mockReturnValue({} as unknown as NextResponse);
    const nextSpy = vi
      .spyOn(NextResponse, 'next')
      .mockReturnValue({} as unknown as NextResponse);

    // Act
    await middleware(req);

    // Assert
    expect(redirectSpy).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalled();
  });
});
