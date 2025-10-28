import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useServerFormState } from '@/hooks/useServerFormState';
import { useForm } from 'react-hook-form';
import type { TState } from '@/types/general/server';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import type { MockFormReturn } from '@/types/tests';

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(),
}));

describe('useServerFormState', () => {
  const mockSetError = vi.fn();
  const mockForm: MockFormReturn<FieldValues> = {
    setError: mockSetError,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockForm);
  });

  it('should handle validation errors', () => {
    const validationState: TState = {
      type: 'validation',
      fields: {
        email: 'Email is required',
        password: 'Password must be at least 8 characters',
      },
    };

    renderHook(() =>
      useServerFormState(
        validationState,
        mockForm as UseFormReturn<FieldValues>
      )
    );

    expect(mockSetError).toHaveBeenCalledWith('email', {
      message: 'Email is required',
    });
    expect(mockSetError).toHaveBeenCalledWith('password', {
      message: 'Password must be at least 8 characters',
    });
  });

  it('should handle server errors', () => {
    const errorState: TState = {
      type: 'error',
      message: 'Server error occurred',
    };

    renderHook(() =>
      useServerFormState(errorState, mockForm as UseFormReturn<FieldValues>)
    );

    expect(mockSetError).toHaveBeenCalledWith('root', {
      message: 'Server error occurred',
    });
  });
});
