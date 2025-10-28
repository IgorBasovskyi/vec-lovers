import { describe, it, expect, vi } from 'vitest';
import { buildSearchParams } from '@/utils/loadMore/client';
import { fetchWithPagination } from '@/utils/loadMore/server';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '@/constants/general';

describe('loadMore utilities', () => {
  it('should build search params with default values', async () => {
    const searchParams = {};
    const result = await buildSearchParams(searchParams);

    expect(result).toEqual({
      search: undefined,
      offset: DEFAULT_OFFSET,
      limit: DEFAULT_LIMIT,
    });
  });

  it('should fetch with pagination when offset > default', async () => {
    const params = {
      search: 'test',
      offset: 20,
      limit: 10,
    };

    const mockFetchFunction = vi.fn().mockResolvedValue({ data: 'test' });
    const result = await fetchWithPagination(params, mockFetchFunction);

    expect(mockFetchFunction).toHaveBeenCalledWith({
      search: 'test',
      offset: DEFAULT_OFFSET,
      limit: 30, // offset + limit = 20 + 10
    });
    expect(result).toEqual({ data: 'test' });
  });
});
