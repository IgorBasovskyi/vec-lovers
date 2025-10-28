import { describe, it, expect } from 'vitest';
import { sanitizeSVG } from '@/utils/sanitize';

const maliciousSVG =
  '<svg><script>alert("xss")</script><circle cx="50" cy="50" r="40" /></svg>';
const validSVG = '<svg><circle cx="50" cy="50" r="40" fill="red" /></svg>';

describe('sanitizeSVG', () => {
  it('should sanitize valid SVG content', () => {
    const result = sanitizeSVG(validSVG);

    expect(result).toContain('<svg>');
    expect(result).toContain('<circle');
    expect(result).toContain('fill="red"');
  });

  it('should remove script tags from SVG', () => {
    const result = sanitizeSVG(maliciousSVG);

    expect(result).not.toContain('<script>');
    expect(result).toContain('<circle');
  });
});
