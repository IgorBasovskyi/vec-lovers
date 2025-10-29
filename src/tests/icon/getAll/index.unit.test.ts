import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllIconsAction } from '@/actions/icon/getAll/getAll';
import { redirect } from 'next/navigation';

// Test data
import { MOCK_ICONS, MOCK_TOTAL } from '../../testData/icon';
import { MOCK_SESSION } from '../../testData/session';

// Mock helpers
import {
  mockSessionFound,
  mockSessionNotFound,
  mockSessionNoUserId,
} from '../../mockHelpers/session';
import {
  mockPrismaCount,
  mockPrismaFindMany,
  mockPrismaError,
} from '../../mockHelpers/icon';
import { mockHandlePrismaError } from '../../mockHelpers/server';

// -------------------- Mocks --------------------

vi.mock('@/utils/prisma', () => ({
  default: {
    icon: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@/utils/auth/server', () => ({
  verifySession: vi.fn(),
}));

vi.mock('@/utils/general/server', () => ({
  handlePrismaError: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('next/cache', () => ({
  unstable_cache: vi.fn((fn) => fn),
}));

// -------------------- Tests --------------------

describe('getAllIconsAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to login when no session exists', async () => {
    // Arrange
    mockSessionNotFound();

    // Act & Assert
    await expect(getAllIconsAction()).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('should redirect to login when session has no userId', async () => {
    // Arrange
    mockSessionNoUserId();

    // Act & Assert
    await expect(getAllIconsAction()).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('should return icons with pagination when successful', async () => {
    // Arrange
    mockSessionFound();
    mockPrismaCount(MOCK_TOTAL);
    mockPrismaFindMany(MOCK_ICONS);

    // Act
    const result = await getAllIconsAction();

    // Assert
    expect(result).toEqual({
      data: MOCK_ICONS,
      pagination: {
        hasMore: false,
        total: MOCK_TOTAL,
      },
    });
  });

  it('should return icons with hasMore true when there are more results', async () => {
    // Arrange
    const largeIconList = Array.from({ length: 25 }, (_, i) => ({
      ...MOCK_ICONS[0],
      id: i.toString(),
      title: `Icon ${i}`,
    }));

    mockSessionFound();
    mockPrismaCount(50);
    mockPrismaFindMany(largeIconList);

    // Act
    const result = await getAllIconsAction({ limit: 20, offset: 0 });

    // Assert
    expect(result).toEqual({
      data: largeIconList,
      pagination: {
        hasMore: true,
        total: 50,
      },
    });
  });

  it('should handle database errors', async () => {
    // Arrange
    mockSessionFound();
    mockPrismaError();
    mockHandlePrismaError({ type: 'error', message: 'Database error' });

    // Act
    const result = await getAllIconsAction();

    // Assert
    expect(result).toEqual({
      type: 'error',
      message: 'Database error',
    });
  });

  it('should use default parameters when none provided', async () => {
    // Arrange
    mockSessionFound();
    mockPrismaCount(MOCK_TOTAL);
    mockPrismaFindMany(MOCK_ICONS);

    // Act
    await getAllIconsAction();

    // Assert
    const { default: prisma } = await import('@/utils/prisma');
    expect(prisma.icon.count).toHaveBeenCalledWith({
      where: {
        userId: MOCK_SESSION.userId,
      },
    });
    expect(prisma.icon.findMany).toHaveBeenCalledWith({
      where: {
        userId: MOCK_SESSION.userId,
      },
      skip: 0,
      take: 20,
      orderBy: [{ liked: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        description: true,
        svgIcon: true,
        category: true,
        liked: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });
  });

  it('should return empty data when no icons found', async () => {
    // Arrange
    mockSessionFound();
    mockPrismaCount(0);
    mockPrismaFindMany([]);

    // Act
    const result = await getAllIconsAction();

    // Assert
    expect(result).toEqual({
      data: [],
      pagination: {
        hasMore: false,
        total: 0,
      },
    });
  });

  it('should handle search parameters correctly', async () => {
    // Arrange
    mockSessionFound();
    mockPrismaCount(MOCK_TOTAL);
    mockPrismaFindMany(MOCK_ICONS);

    // Act
    await getAllIconsAction({ search: 'test search' });

    // Assert
    const { default: prisma } = await import('@/utils/prisma');
    expect(prisma.icon.count).toHaveBeenCalledWith({
      where: {
        userId: MOCK_SESSION.userId,
        OR: [
          { title: { contains: 'test search', mode: 'insensitive' } },
          { description: { contains: 'test search', mode: 'insensitive' } },
          { category: { contains: 'test search', mode: 'insensitive' } },
        ],
      },
    });
  });

  it('should handle isLiked filter correctly', async () => {
    // Arrange
    mockSessionFound();
    mockPrismaCount(MOCK_TOTAL);
    mockPrismaFindMany(MOCK_ICONS);

    // Act
    await getAllIconsAction({ isLiked: true });

    // Assert
    const { default: prisma } = await import('@/utils/prisma');
    expect(prisma.icon.count).toHaveBeenCalledWith({
      where: {
        userId: MOCK_SESSION.userId,
        liked: true,
      },
    });
  });

  it('should handle category filter correctly', async () => {
    // Arrange
    mockSessionFound();
    mockPrismaCount(MOCK_TOTAL);
    mockPrismaFindMany(MOCK_ICONS);

    // Act
    await getAllIconsAction({ category: 'test-category' });

    // Assert
    const { default: prisma } = await import('@/utils/prisma');
    expect(prisma.icon.count).toHaveBeenCalledWith({
      where: {
        userId: MOCK_SESSION.userId,
        category: { contains: 'test-category', mode: 'insensitive' },
      },
    });
  });
});
