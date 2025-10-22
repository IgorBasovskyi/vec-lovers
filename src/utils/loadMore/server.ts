import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "@/constants/general";
import { PaginationParams } from "@/types/loadMore/server";

// Generic helper to fetch data with pagination (fetches all data up to current offset)
export const fetchWithPagination = async <T extends PaginationParams, R>(
  params: T,
  fetchFunction: (params: T) => Promise<R>
): Promise<R> => {
  // For pagination, we need to fetch all data up to the current offset
  const fetchParams =
    params.offset && params.offset > DEFAULT_OFFSET
      ? {
          ...params,
          offset: DEFAULT_OFFSET,
          limit: params.offset + (params.limit ?? DEFAULT_LIMIT),
        }
      : params;

  return await fetchFunction(fetchParams);
};
