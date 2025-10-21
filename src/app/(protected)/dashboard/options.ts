import { createPaginatedAction } from "@/actions/general/loadMore/loadMore";
import { getAllIconsAction } from "@/actions/icon/getAll/getAll";
import { GetAllIconsParams, GetAllIconsResponse } from "@/types/icon/general";
import { DashboardPageProps } from "@/types/pages/dashboard";
import { buildSearchParams } from "@/utils/loadMore/client";
import { DEFAULT_LIMIT } from "@/constants/general";

// Create the paginated action using the generic wrapper
const fetchIconsWithPagination = await createPaginatedAction<
  GetAllIconsParams,
  GetAllIconsResponse
>(getAllIconsAction);

export const dashboardOptions = async ({
  searchParams,
}: DashboardPageProps) => {
  const resolvedSearchParams = await searchParams;
  const baseParams = await buildSearchParams<GetAllIconsParams>(
    resolvedSearchParams || {},
    DEFAULT_LIMIT
  );

  // Add icon-specific parameters
  const params: GetAllIconsParams = {
    ...baseParams,
    category:
      resolvedSearchParams?.category && resolvedSearchParams.category !== "All"
        ? resolvedSearchParams.category
        : undefined,
    isLiked: resolvedSearchParams?.liked
      ? resolvedSearchParams.liked === "Liked"
      : undefined,
  };

  const response = await fetchIconsWithPagination(params);

  // Filter configuration
  const filters = [
    {
      name: "category",
      label: "Category",
      options: ["All", "UI", "Marketing", "Social", "Other"],
      initialValue: resolvedSearchParams?.category,
    },
    {
      name: "liked",
      label: "Liked",
      options: ["All", "Liked", "Unliked"],
      initialValue: resolvedSearchParams?.liked,
    },
  ];

  return {
    response,
    filters,
    resolvedSearchParams,
    params,
  };
};
