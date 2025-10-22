"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface LoadMoreButtonProps {
  currentOffset: number;
  limit: number;
  hasMore: boolean;
  className?: string;
  buttonText?: string;
  loadingText?: string;
  offsetParamName?: string;
  onLoadMore?: () => void; // Optional callback for custom load more logic
}

const LoadMoreButton = ({
  currentOffset,
  limit,
  hasMore,
  className = "min-w-32",
  buttonText = "Load More",
  loadingText = "Loading...",
  offsetParamName = "offset",
  onLoadMore,
}: LoadMoreButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLoadMore = () => {
    if (isPending) return;

    startTransition(() => {
      if (onLoadMore) {
        // Use custom load more logic
        onLoadMore();
      } else {
        // Use default URL-based pagination
        const nextOffset = currentOffset + limit;

        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set(offsetParamName, nextOffset.toString());

        router.push(`?${newSearchParams.toString()}`);
      }
    });
  };

  if (!hasMore) return null;

  return (
    <div className="flex justify-center">
      <Button
        onClick={handleLoadMore}
        disabled={isPending}
        variant="outline"
        className={className}
      >
        {isPending ? loadingText : buttonText}
      </Button>
    </div>
  );
};

export default LoadMoreButton;
