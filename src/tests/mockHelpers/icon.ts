import { Mock } from 'vitest';
import prisma from '@/utils/prisma';
import { getFormFields } from '@/utils/general';
import { addIconSchema } from '@/schemas/addIconSchema';
import { isValidationError } from '@/utils/general/server';
import { VALID_ICON_DATA, MOCK_ICONS } from '../testData/icon';

export const mockGetFormFields = (fields: Record<string, string>) => {
  (getFormFields as unknown as Mock).mockReturnValue(fields);
};

export const mockValidationSuccess = (data: typeof VALID_ICON_DATA) => {
  (addIconSchema.validate as unknown as Mock).mockResolvedValue(data);
  (isValidationError as unknown as Mock).mockReturnValue(false);
};

export const mockValidationFailure = (
  errors: Array<{ path: string; message: string }>
) => {
  const validationError = { inner: errors };
  (addIconSchema.validate as unknown as Mock).mockRejectedValue(
    validationError
  );
  (isValidationError as unknown as Mock).mockReturnValue(true);
};

export const mockValidationError = () => {
  (addIconSchema.validate as unknown as Mock).mockRejectedValue(
    new Error('Schema error')
  );
  (isValidationError as unknown as Mock).mockReturnValue(false);
};

export const mockIconCreation = () => {
  (prisma.icon.create as unknown as Mock).mockResolvedValue({ id: 'icon123' });
};

export const mockIconCreationError = () => {
  (prisma.icon.create as unknown as Mock).mockRejectedValue(
    new Error('Database error')
  );
};

export const mockPrismaCount = (count: number) => {
  (prisma.icon.count as unknown as Mock).mockResolvedValue(count);
};

export const mockPrismaFindMany = (icons: typeof MOCK_ICONS) => {
  (prisma.icon.findMany as unknown as Mock).mockResolvedValue(icons);
};

export const mockPrismaError = () => {
  (prisma.icon.count as unknown as Mock).mockRejectedValue(
    new Error('Database error')
  );
};
