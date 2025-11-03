import { vi } from 'vitest';

// -------------------- Next.js Navigation Mock Helpers --------------------
export const mockPush = vi.fn();
export const mockReplace = vi.fn();
export const mockRefresh = vi.fn();

export const createMockRouter = () => ({
  push: mockPush,
  replace: mockReplace,
  refresh: mockRefresh,
});

export const createMockSearchParams = (params?: Record<string, string>) => {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
  }
  return searchParams;
};
