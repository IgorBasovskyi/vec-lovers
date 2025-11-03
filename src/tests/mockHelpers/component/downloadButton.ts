import { vi } from 'vitest';

// -------------------- URL Mock Helpers --------------------
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

export const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
export const mockRevokeObjectURL = vi.fn();

export const setupURLMocks = () => {
  URL.createObjectURL = mockCreateObjectURL;
  URL.revokeObjectURL = mockRevokeObjectURL;
};

export const restoreURLMocks = () => {
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
};

// -------------------- Document Mock Helpers --------------------
const originalCreateElement = document.createElement;

export interface MockAnchorElement {
  href: string;
  download: string;
  click: ReturnType<typeof vi.fn>;
}

export const mockClick = vi.fn();
export const mockAnchorElement: MockAnchorElement = {
  href: '',
  download: '',
  click: mockClick,
};

export const setupDocumentMocks = () => {
  document.createElement = vi.fn((tagName: string) => {
    if (tagName === 'a') {
      // Reset anchor properties for each new anchor
      mockAnchorElement.href = '';
      mockAnchorElement.download = '';
      return mockAnchorElement as unknown as ReturnType<
        typeof originalCreateElement
      >;
    }
    return originalCreateElement.call(document, tagName);
  }) as typeof document.createElement;
};

export const restoreDocumentMocks = () => {
  document.createElement = originalCreateElement;
};

export const resetAnchorElement = () => {
  mockAnchorElement.href = '';
  mockAnchorElement.download = '';
};

// -------------------- Blob Helper --------------------
export const getBlobFromMock = (mockFn: typeof mockCreateObjectURL): Blob => {
  const calls = mockFn.mock.calls;
  if (calls.length === 0 || !calls[0] || calls[0].length === 0) {
    throw new Error('No blob created');
  }
  const blobCall = (calls[0] as unknown as [Blob])[0];
  if (!blobCall) {
    throw new Error('Blob call is undefined');
  }
  return blobCall;
};
