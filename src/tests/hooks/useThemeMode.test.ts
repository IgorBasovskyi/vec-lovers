import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useTheme } from 'next-themes';
import type { MockUseThemeReturn } from '@/types/tests';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('useThemeMode', () => {
  it('should return dark theme when theme is dark', () => {
    const mockReturn: MockUseThemeReturn = {
      theme: 'dark',
      systemTheme: 'light',
    };

    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockReturn
    );

    const { result } = renderHook(() => useThemeMode());

    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(result.current.isLight).toBe(false);
  });

  it('should return light theme when theme is light', () => {
    const mockReturn: MockUseThemeReturn = {
      theme: 'light',
      systemTheme: 'dark',
    };

    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockReturn
    );

    const { result } = renderHook(() => useThemeMode());

    expect(result.current.theme).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(result.current.isLight).toBe(true);
  });
});
