import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addIconAction } from '@/actions/icon/add/add';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

// Test data
import {
  VALID_ICON_DATA,
  INVALID_ICON_DATA,
  ICON_VALIDATION_ERRORS,
} from '../../testData/icon';
import { MOCK_SESSION } from '../../testData/session';

// Mock helpers
import {
  mockSessionFound,
  mockSessionNotFound,
  mockSessionNoUserId,
} from '../../mockHelpers/session';
import {
  mockGetFormFields,
  mockValidationSuccess,
  mockValidationFailure,
  mockValidationError,
  mockIconCreation,
  mockIconCreationError,
} from '../../mockHelpers/icon';
import {
  mockServerError,
  mockSuccessMessage,
  mockValidationErrorResponse,
  mockHandlePrismaError,
} from '../../mockHelpers/server';

// -------------------- Mocks --------------------

vi.mock('@/utils/prisma', () => ({
  default: {
    icon: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@/utils/auth/server', () => ({
  verifySession: vi.fn(),
}));

vi.mock('@/utils/general/server', () => ({
  createServerError: vi.fn(),
  createSuccessMessage: vi.fn(),
  createValidationError: vi.fn(),
  handlePrismaError: vi.fn(),
  isValidationError: vi.fn(),
}));

vi.mock('@/utils/general', () => ({
  getFormFields: vi.fn(),
}));

vi.mock('@/schemas/addIconSchema', () => ({
  addIconSchema: {
    validate: vi.fn(),
  },
}));

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

// -------------------- Tests --------------------

describe('addIconAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to login when no session exists', async () => {
    // Arrange
    mockSessionNotFound();
    const formData = new FormData();

    // Act & Assert
    await expect(addIconAction(null, formData)).rejects.toThrow(
      'NEXT_REDIRECT'
    );
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('should redirect to login when session has no userId', async () => {
    // Arrange
    mockSessionNoUserId();
    const formData = new FormData();

    // Act & Assert
    await expect(addIconAction(null, formData)).rejects.toThrow(
      'NEXT_REDIRECT'
    );
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('should return validation errors when form data is invalid', async () => {
    // Arrange
    mockSessionFound();
    mockGetFormFields(INVALID_ICON_DATA);
    mockValidationFailure([
      { path: 'title', message: ICON_VALIDATION_ERRORS.title },
      {
        path: 'description',
        message: ICON_VALIDATION_ERRORS.description,
      },
      { path: 'svgIcon', message: ICON_VALIDATION_ERRORS.svgIcon },
      {
        path: 'category',
        message: ICON_VALIDATION_ERRORS.category,
      },
    ]);
    mockValidationErrorResponse({
      title: ICON_VALIDATION_ERRORS.title,
      description: ICON_VALIDATION_ERRORS.description,
      svgIcon: ICON_VALIDATION_ERRORS.svgIcon,
      category: ICON_VALIDATION_ERRORS.category,
    });

    const formData = new FormData();

    // Act
    const result = await addIconAction(null, formData);

    // Assert
    expect(result).toEqual({
      type: 'validation',
      fields: {
        title: ICON_VALIDATION_ERRORS.title,
        description: ICON_VALIDATION_ERRORS.description,
        svgIcon: ICON_VALIDATION_ERRORS.svgIcon,
        category: ICON_VALIDATION_ERRORS.category,
      },
    });
  });

  it('should return server error when validation fails with non-validation error', async () => {
    // Arrange
    mockSessionFound();
    mockGetFormFields(VALID_ICON_DATA);
    mockValidationError();
    mockServerError();

    const formData = new FormData();

    // Act
    const result = await addIconAction(null, formData);

    // Assert
    expect(result).toEqual({
      type: 'error',
      message: 'Server error. Please try again later.',
    });
  });

  it('should successfully create icon when all data is valid', async () => {
    // Arrange
    mockSessionFound();
    mockGetFormFields(VALID_ICON_DATA);
    mockValidationSuccess(VALID_ICON_DATA);
    mockIconCreation();
    mockSuccessMessage('Icon added successfully!');

    const formData = new FormData();

    // Act
    const result = await addIconAction(null, formData);

    // Assert
    expect(result).toEqual({
      type: 'success',
      message: 'Icon added successfully!',
    });
    expect(revalidateTag).toHaveBeenCalledWith('icons');
  });

  it('should handle database errors during icon creation', async () => {
    // Arrange
    mockSessionFound();
    mockGetFormFields(VALID_ICON_DATA);
    mockValidationSuccess(VALID_ICON_DATA);
    mockIconCreationError();
    mockHandlePrismaError({ type: 'error', message: 'Database error' });

    const formData = new FormData();

    // Act
    const result = await addIconAction(null, formData);

    // Assert
    expect(result).toEqual({
      type: 'error',
      message: 'Database error',
    });
  });

  it('should trim string fields before saving', async () => {
    // Arrange
    const dataWithSpaces = {
      title: '  Test Icon  ',
      description: '  A test description  ',
      svgIcon: '  <svg><path d="M10 10"/></svg>  ',
      category: '  test  ',
    };

    mockSessionFound();
    mockGetFormFields(dataWithSpaces);
    mockValidationSuccess(dataWithSpaces);
    mockIconCreation();
    mockSuccessMessage('Icon added successfully!');

    const formData = new FormData();

    // Act
    await addIconAction(null, formData);

    // Assert
    const { default: prisma } = await import('@/utils/prisma');
    expect(prisma.icon.create).toHaveBeenCalledWith({
      data: {
        title: 'Test Icon',
        description: 'A test description',
        svgIcon: '<svg><path d="M10 10"/></svg>',
        category: 'test',
        userId: MOCK_SESSION.userId,
      },
    });
  });

  it('should handle optional fields correctly', async () => {
    // Arrange
    const dataWithOptionalFields = {
      title: 'Test Icon',
      description: '',
      svgIcon: '<svg><path d="M10 10"/></svg>',
      category: '',
    };

    mockSessionFound();
    mockGetFormFields(dataWithOptionalFields);
    mockValidationSuccess(dataWithOptionalFields);
    mockIconCreation();
    mockSuccessMessage('Icon added successfully!');

    const formData = new FormData();

    // Act
    await addIconAction(null, formData);

    // Assert
    const { default: prisma } = await import('@/utils/prisma');
    expect(prisma.icon.create).toHaveBeenCalledWith({
      data: {
        title: 'Test Icon',
        description: null,
        svgIcon: '<svg><path d="M10 10"/></svg>',
        category: null,
        userId: MOCK_SESSION.userId,
      },
    });
  });
});
