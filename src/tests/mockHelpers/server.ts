import { Mock } from 'vitest';
import {
  createServerError,
  createSuccessMessage,
  createValidationError,
  handlePrismaError,
} from '@/utils/general/server';

export const mockServerError = (message?: string) => {
  (createServerError as unknown as Mock).mockReturnValue({
    type: 'error',
    message: message || 'Server error. Please try again later.',
  });
};

export const mockSuccessMessage = (message: string) => {
  (createSuccessMessage as unknown as Mock).mockReturnValue({
    type: 'success',
    message,
  });
};

export const mockValidationErrorResponse = (fields: Record<string, string>) => {
  (createValidationError as unknown as Mock).mockReturnValue({
    type: 'validation',
    fields,
  });
};

export const mockHandlePrismaError = (response: {
  type: string;
  message: string;
}) => {
  (handlePrismaError as unknown as Mock).mockReturnValue(response);
};
