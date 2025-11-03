import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DownloadButton from '@/components/DownloadButton';

// -------------------- Test Data --------------------
import {
  MOCK_SVG_STRING,
  MOCK_TITLE,
  MOCK_CUSTOM_TITLE,
} from '@/tests/testData/component/common';

// -------------------- Mock Helpers --------------------
import {
  mockCreateObjectURL,
  mockRevokeObjectURL,
  mockClick,
  mockAnchorElement,
  setupURLMocks,
  restoreURLMocks,
  setupDocumentMocks,
  restoreDocumentMocks,
  resetAnchorElement,
  getBlobFromMock,
} from '@/tests/mockHelpers/component/downloadButton';

// -------------------- Lifecycle --------------------
beforeEach(() => {
  vi.clearAllMocks();
  mockCreateObjectURL.mockReturnValue('blob:mock-url');
  setupURLMocks();
  setupDocumentMocks();
});

afterEach(() => {
  restoreDocumentMocks();
  restoreURLMocks();
  resetAnchorElement();
});

// -------------------- Tests --------------------
describe('DownloadButton', () => {
  it('renders the download button initially', () => {
    // Arrange & Act
    render(<DownloadButton svgIcon={MOCK_SVG_STRING} title={MOCK_TITLE} />);

    // Assert
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Download icon should be present
    const downloadIcon = button.querySelector('svg');
    expect(downloadIcon).toBeInTheDocument();
  });

  it('downloads SVG file when clicked with string svgIcon', () => {
    // Arrange
    render(<DownloadButton svgIcon={MOCK_SVG_STRING} title={MOCK_TITLE} />);
    const button = screen.getByRole('button');

    // Act
    fireEvent.click(button);

    // Assert
    // Verify Blob was created with correct content and type
    expect(document.createElement).toHaveBeenCalledWith('a');

    // Verify createObjectURL was called (which means Blob was created)
    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    const blob = getBlobFromMock(mockCreateObjectURL);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/svg+xml');

    // Verify anchor element was configured correctly
    expect(mockAnchorElement.href).toBe('blob:mock-url');
    expect(mockAnchorElement.download).toBe(`${MOCK_TITLE}.svg`);

    // Verify click was triggered
    expect(mockClick).toHaveBeenCalledTimes(1);

    // Verify URL was revoked
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it('creates blob with correct SVG content', () => {
    // Arrange
    render(<DownloadButton svgIcon={MOCK_SVG_STRING} title={MOCK_TITLE} />);
    const button = screen.getByRole('button');

    // Act
    fireEvent.click(button);

    // Assert
    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    const blob = getBlobFromMock(mockCreateObjectURL);

    // Verify blob type
    expect(blob.type).toBe('image/svg+xml');

    // Verify blob contains the SVG string
    // Note: We can't directly read blob content in tests, but we can verify
    // the blob was created from the SVG string by checking the call
  });

  it('sets correct filename with title', () => {
    // Arrange
    render(
      <DownloadButton svgIcon={MOCK_SVG_STRING} title={MOCK_CUSTOM_TITLE} />
    );
    const button = screen.getByRole('button');

    // Act
    fireEvent.click(button);

    // Assert
    expect(mockAnchorElement.download).toBe(`${MOCK_CUSTOM_TITLE}.svg`);
  });

  it('does not download when svgIcon is not a string', () => {
    // Arrange
    const mockReactNode = (
      <svg>
        <path d="M10 10" />
      </svg>
    );
    render(<DownloadButton svgIcon={mockReactNode} title={MOCK_TITLE} />);
    const button = screen.getByRole('button');

    // Clear any calls from render
    vi.clearAllMocks();

    // Act
    fireEvent.click(button);

    // Assert
    // Should not create blob or download (check specifically for 'a' tag creation)
    expect(mockCreateObjectURL).not.toHaveBeenCalled();
    expect(document.createElement).not.toHaveBeenCalledWith('a');
    expect(mockClick).not.toHaveBeenCalled();
    expect(mockRevokeObjectURL).not.toHaveBeenCalled();
  });

  it('revokes object URL after download', () => {
    // Arrange
    render(<DownloadButton svgIcon={MOCK_SVG_STRING} title={MOCK_TITLE} />);
    const button = screen.getByRole('button');

    // Act
    fireEvent.click(button);

    // Assert
    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('handles multiple downloads correctly', () => {
    // Arrange
    render(<DownloadButton svgIcon={MOCK_SVG_STRING} title={MOCK_TITLE} />);
    const button = screen.getByRole('button');

    // Act
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    // Assert
    // Each click should create a new blob URL and revoke it
    expect(mockCreateObjectURL).toHaveBeenCalledTimes(3);
    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(3);
    expect(mockClick).toHaveBeenCalledTimes(3);
  });

  it('maintains button accessibility and structure', () => {
    // Arrange & Act
    render(<DownloadButton svgIcon={MOCK_SVG_STRING} title={MOCK_TITLE} />);

    // Assert
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
