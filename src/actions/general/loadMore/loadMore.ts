"use server";

import { PaginatedResponse, PaginationParams } from "@/types/loadMore/server";
import { fetchWithPagination } from "@/utils/loadMore/server";

// Generic wrapper for paginated actions with error handling and fallback
export const createPaginatedAction = async <
  T extends PaginationParams,
  R extends PaginatedResponse<unknown>
>(
  fetchFunction: (params: T) => Promise<R | unknown>
) => {
  return async (params: T): Promise<R> => {
    const data = await fetchWithPagination(params, fetchFunction);

    if (data && typeof data === "object" && data !== null && "data" in data) {
      return data as R;
    }

    // Fallback empty response
    return {
      data: [],
      pagination: {
        hasMore: false,
        total: 0,
      },
    } as unknown as R;
  };
};
