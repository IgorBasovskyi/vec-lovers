import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useToast } from '@/hooks/useToast';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { TState } from '@/types/general/server';
import type { MockSearchParams, MockRouter } from '@/types/tests';

// Mocks
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('useToast', () => {
  const mockReplace = vi.fn();
  const mockSearchParams: MockSearchParams = {
    get: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      replace: mockReplace,
    } as MockRouter);
    (useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSearchParams
    );
  });

  it('should show toast for success state', () => {
    const successState: TState = {
      type: 'success',
      message: 'Operation successful',
    };

    renderHook(() => useToast(successState));

    expect(toast.success).toHaveBeenCalledWith('Success', {
      description: 'Operation successful',
      action: { label: 'Close', onClick: expect.any(Function) },
    });
  });

  it('should show toast for error state', () => {
    const errorState: TState = {
      type: 'error',
      message: 'Server error occurred',
    };

    renderHook(() => useToast(errorState));

    expect(toast.error).toHaveBeenCalledWith('Server Error', {
      description: 'Server error occurred',
      action: { label: 'Close', onClick: expect.any(Function) },
    });
  });
});
