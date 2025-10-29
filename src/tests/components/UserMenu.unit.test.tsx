import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserMenu from '@/components/UserMenu';
import { getUser } from '@/actions/user/getUser';
import { IUser } from '@/types/user/general';
import { IServerError } from '@/types/general/server';

// -------------------- Test Data --------------------

const MOCK_USER: IUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
};

const MOCK_SERVER_ERROR: IServerError = {
  type: 'error',
  message: 'User not found',
};

// -------------------- Mocks --------------------

vi.mock('@/actions/user/getUser', () => ({
  getUser: vi.fn(),
}));

// -------------------- Test Helpers --------------------

const mockGetUser = (response: IUser | IServerError) => {
  (getUser as unknown as Mock).mockResolvedValue(response);
};

// -------------------- Tests --------------------

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render user menu with user data when getUser returns user', async () => {
    // Arrange
    mockGetUser(MOCK_USER);

    // Act
    const userMenu = await UserMenu();
    render(userMenu);

    // Assert
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', MOCK_USER.username);
    expect(button).toHaveTextContent(MOCK_USER.username[0].toUpperCase());
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('should render user menu with error state when getUser returns server error', async () => {
    // Arrange
    mockGetUser(MOCK_SERVER_ERROR);

    // Act
    const userMenu = await UserMenu();
    render(userMenu);

    // Assert
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Failed to load user');
    expect(button).toHaveTextContent('U');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('should handle empty username gracefully', async () => {
    // Arrange
    const userWithEmptyUsername = { ...MOCK_USER, username: '' };
    mockGetUser(userWithEmptyUsername);

    // Act
    const userMenu = await UserMenu();
    render(userMenu);

    // Assert
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('U');
  });

  it('should handle single character username', async () => {
    // Arrange
    const userWithSingleChar = { ...MOCK_USER, username: 'a' };
    mockGetUser(userWithSingleChar);

    // Act
    const userMenu = await UserMenu();
    render(userMenu);

    // Assert
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('A');
  });
});
