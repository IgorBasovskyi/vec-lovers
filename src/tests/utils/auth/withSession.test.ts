import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { withSession } from '@/utils/auth/withSession';
import { verifySession } from '@/utils/auth/server';
import { createServerError } from '@/utils/general/server';
import { redirect } from 'next/navigation';

// -------------------- Mocks --------------------

vi.mock('@/utils/auth/server', () => ({
  verifySession: vi.fn(),
}));

vi.mock('@/utils/general/server', () => ({
  createServerError: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

// -------------------- Test Helpers --------------------

const mockSessionFound = (userId: string) => {
  (verifySession as unknown as Mock).mockResolvedValue({
    isAuth: true,
    userId,
  });
};

const mockSessionNotFound = () => {
  (verifySession as unknown as Mock).mockResolvedValue({
    isAuth: false,
    userId: undefined,
  });
};

const mockServerError = (message: string) => {
  (createServerError as unknown as Mock).mockReturnValue({
    type: 'error',
    message,
  });
};

// -------------------- Tests --------------------

describe('withSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to login when no session exists', async () => {
    // Arrange
    mockSessionNotFound();
    const handler = vi.fn();
    const wrappedHandler = withSession(handler);

    // Act & Assert
    await expect(wrappedHandler()).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/login');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should call handler with session when session exists', async () => {
    // Arrange
    const userId = '123';
    mockSessionFound(userId);
    const handler = vi.fn().mockResolvedValue('success');
    const wrappedHandler = withSession(handler);

    // Act
    const result = await wrappedHandler();

    // Assert
    expect(result).toBe('success');
    expect(handler).toHaveBeenCalledWith({ userId });
  });

  it('should return server error when session has no userId', async () => {
    // Arrange
    (verifySession as unknown as Mock).mockResolvedValue({
      isAuth: true,
      userId: undefined,
    });
    mockServerError('User session invalid');
    const handler = vi.fn();
    const wrappedHandler = withSession(handler);

    // Act
    const result = await wrappedHandler();

    // Assert
    expect(result).toEqual({
      type: 'error',
      message: 'User session invalid',
    });
    expect(createServerError).toHaveBeenCalledWith('User session invalid');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should not require userId when requireUser is false', async () => {
    // Arrange
    (verifySession as unknown as Mock).mockResolvedValue({
      isAuth: true,
      userId: undefined,
    });
    const handler = vi.fn().mockResolvedValue('success');
    const wrappedHandler = withSession(handler, { requireUser: false });

    // Act
    const result = await wrappedHandler();

    // Assert
    expect(result).toBe('success');
    expect(handler).toHaveBeenCalledWith({ userId: undefined });
  });
});
