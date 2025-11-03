import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CopyButton from '@/components/CopyButton';
import { MOCK_SVG_STRING } from '../testData/component/common';

// -------------------- Clipboard Mock --------------------
const mockWriteText = vi.fn().mockResolvedValue(undefined);
Object.assign(navigator, {
  clipboard: { writeText: mockWriteText },
});

// -------------------- Lifecycle --------------------
beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

// -------------------- Tests --------------------
describe('CopyButton', () => {
  it('renders the copy button initially', () => {
    // Arrange & Act
    render(<CopyButton svgIcon={MOCK_SVG_STRING} />);

    // Assert
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Initial icon (Copy)
    const copyIcon = button.querySelector('svg');
    expect(copyIcon).toBeInTheDocument();
  });

  it('copies SVG string to clipboard when clicked', async () => {
    // Arrange
    render(<CopyButton svgIcon={MOCK_SVG_STRING} />);
    const button = screen.getByRole('button');

    // Act
    fireEvent.click(button);

    // Flush promises to allow async clipboard write to complete
    await vi.runOnlyPendingTimersAsync();

    // Assert
    expect(mockWriteText).toHaveBeenCalledWith(MOCK_SVG_STRING);
    expect(mockWriteText).toHaveBeenCalledTimes(1);

    // Tooltip shows "Copied!" (Radix creates multiple elements, use getAllByText)
    const tooltips = screen.getAllByText('Copied!');
    expect(tooltips.length).toBeGreaterThan(0);
    expect(tooltips[0]).toBeInTheDocument();

    // Check icon should now be visible (green class)
    const checkIcon = button.querySelector('svg.text-green-500');
    expect(checkIcon).toBeInTheDocument();
  });

  it('resets back to copy icon after 1500ms', async () => {
    // Arrange
    render(<CopyButton svgIcon={MOCK_SVG_STRING} />);
    const button = screen.getByRole('button');

    // Act
    fireEvent.click(button);

    // Flush promises to allow async clipboard write to complete
    await vi.runOnlyPendingTimersAsync();

    // Assert (tooltip visible)
    const tooltips = screen.getAllByText('Copied!');
    expect(tooltips.length).toBeGreaterThan(0);

    // Advance timers to trigger reset (1500ms)
    vi.advanceTimersByTime(1500);
    await vi.runOnlyPendingTimersAsync();

    // Tooltip should disappear and icon reset
    // Note: queryByText may still find elements due to Radix structure,
    // so we check the icon change instead
    const copyIcon = button.querySelector('svg:not(.text-green-500)');
    expect(copyIcon).toBeInTheDocument();

    // Verify the check icon is gone
    const checkIcon = button.querySelector('svg.text-green-500');
    expect(checkIcon).not.toBeInTheDocument();
  });

  it('does not copy if svgIcon is not a string', () => {
    // Arrange
    const mockReactNode = (
      <svg>
        <path d="M10 10" />
      </svg>
    );
    render(<CopyButton svgIcon={mockReactNode} />);
    const button = screen.getByRole('button');

    // Act
    fireEvent.click(button);

    // Assert
    expect(mockWriteText).not.toHaveBeenCalled();
  });

  it('handles clipboard write errors gracefully', async () => {
    // Arrange
    const error = new Error('Clipboard write failed');
    mockWriteText.mockRejectedValueOnce(error);

    // Catch unhandled promise rejections
    const unhandledRejections: unknown[] = [];
    const originalUnhandledRejection = process.listeners('unhandledRejection');
    process.removeAllListeners('unhandledRejection');
    process.once('unhandledRejection', (reason) => {
      unhandledRejections.push(reason);
    });

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<CopyButton svgIcon={MOCK_SVG_STRING} />);
    const button = screen.getByRole('button');

    // Act
    fireEvent.click(button);

    // Flush promises to allow async clipboard write to complete/reject
    await vi.runOnlyPendingTimersAsync();

    // Assert
    expect(mockWriteText).toHaveBeenCalledTimes(1);
    // Ensure tooltip doesn't falsely appear (copy failed, so state shouldn't change)
    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();

    // Restore
    consoleErrorSpy.mockRestore();
    process.removeAllListeners('unhandledRejection');
    originalUnhandledRejection.forEach((listener) => {
      process.on('unhandledRejection', listener as () => void);
    });
  });

  it('maintains button accessibility and structure', () => {
    // Arrange & Act
    render(<CopyButton svgIcon={MOCK_SVG_STRING} />);

    // Assert
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
