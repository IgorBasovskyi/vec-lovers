"use server";

import IconsList from "@/components/IconList";
import LoadMoreButton from "@/components/LoadMoreButton";
import { GetAllIconsParams, GetAllIconsResponse } from "@/types/icon/general";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "@/constants/general";

interface DashboardContentProps {
  initialData: GetAllIconsResponse;
  initialParams: GetAllIconsParams;
}

const DashboardContent = ({
  initialData,
  initialParams,
}: DashboardContentProps) => {
  return (
    <div className="space-y-6">
      <IconsList icons={initialData.data} />

      <LoadMoreButton
        currentOffset={initialParams.offset || DEFAULT_OFFSET}
        limit={initialParams.limit || DEFAULT_LIMIT}
        hasMore={initialData.pagination.hasMore}
      />
    </div>
  );
};

export default DashboardContent;
