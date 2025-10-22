import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "@/constants/general";
import { PaginationParams } from "@/types/loadMore/server";

// Generic helper to build search parameters from URL search params
export const buildSearchParams = async <T extends PaginationParams>(
  searchParams: Record<string, string | undefined>,
  defaultLimit: number = DEFAULT_LIMIT
): Promise<T> => {
  return {
    search: searchParams.search,
    offset: searchParams.offset
      ? parseInt(searchParams.offset)
      : DEFAULT_OFFSET,
    limit: defaultLimit,
  } as unknown as T;
};
