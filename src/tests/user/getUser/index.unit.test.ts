import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { getUser } from '@/actions/user/getUser';
import prisma from '@/utils/prisma';
import { createServerError } from '@/utils/general/server';
import { SERVER_ERRORS } from '@/constants/auth/server';

// -------------------- Test Data --------------------

const MOCK_USER = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
} as const;

// -------------------- Mocks --------------------

vi.mock('@/utils/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/utils/general/server', () => ({
  createServerError: vi.fn(),
}));

vi.mock('@/utils/auth/withSession', () => ({
  withSession: vi.fn((handler) => {
    // Mock withSession to call the handler directly with a mock session
    return async () => {
      const mockSession = { userId: '1' };
      return handler(mockSession);
    };
  }),
}));

// -------------------- Test Helpers --------------------

const mockUserFound = (user: typeof MOCK_USER) => {
  (prisma.user.findUnique as unknown as Mock).mockResolvedValue(user);
};

const mockUserNotFound = () => {
  (prisma.user.findUnique as unknown as Mock).mockResolvedValue(null);
};

const mockDatabaseError = () => {
  (prisma.user.findUnique as unknown as Mock).mockRejectedValue(
    new Error(SERVER_ERRORS.databaseConnectionFailed)
  );
};

const mockServerError = (message?: string) => {
  (createServerError as unknown as Mock).mockReturnValue({
    type: 'error',
    message: message || SERVER_ERRORS.serverError,
  });
};

// -------------------- Tests --------------------

describe('getUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user data when user is found', async () => {
    // Arrange
    mockUserFound(MOCK_USER);

    // Act
    const result = await getUser();

    // Assert
    expect(result).toEqual(MOCK_USER);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: expect.any(String) },
      select: { id: true, username: true, email: true },
    });
  });

  it('should return server error when user is not found in database', async () => {
    // Arrange
    mockUserNotFound();
    mockServerError('User not found');

    // Act
    const result = await getUser();

    // Assert
    expect(result).toEqual({
      type: 'error',
      message: 'User not found',
    });
    expect(createServerError).toHaveBeenCalledWith('User not found');
  });

  it('should return server error when database query fails', async () => {
    // Arrange
    mockDatabaseError();
    mockServerError();

    // Act
    const result = await getUser();

    // Assert
    expect(result).toEqual({
      type: 'error',
      message: SERVER_ERRORS.serverError,
    });
    expect(createServerError).toHaveBeenCalledWith();
  });
});
