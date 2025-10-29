import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { getUser } from '@/actions/user/getUser';
import { createServerError } from '@/utils/general/server';
import { SERVER_ERRORS } from '@/constants/auth/server';

// Test data
import { MOCK_USER_PARTIAL } from '../../testData/auth';

// Mock helpers
import { mockServerError } from '../../mockHelpers/server';

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
const mockUserFound = async (user: typeof MOCK_USER_PARTIAL) => {
  const { default: prisma } = await import('@/utils/prisma');
  (prisma.user.findUnique as unknown as Mock).mockResolvedValue(user);
};

const mockUserNotFound = async () => {
  const { default: prisma } = await import('@/utils/prisma');
  (prisma.user.findUnique as unknown as Mock).mockResolvedValue(null);
};

const mockDatabaseError = async () => {
  const { default: prisma } = await import('@/utils/prisma');
  (prisma.user.findUnique as unknown as Mock).mockRejectedValue(
    new Error(SERVER_ERRORS.databaseConnectionFailed)
  );
};

// -------------------- Tests --------------------
describe('getUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user data when user is found', async () => {
    // Arrange
    await mockUserFound(MOCK_USER_PARTIAL);

    // Act
    const result = await getUser();

    // Assert
    expect(result).toEqual(MOCK_USER_PARTIAL);
    const { default: prisma } = await import('@/utils/prisma');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: expect.any(String) },
      select: { id: true, username: true, email: true },
    });
  });

  it('should return server error when user is not found in database', async () => {
    // Arrange
    await mockUserNotFound();
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
    await mockDatabaseError();
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
