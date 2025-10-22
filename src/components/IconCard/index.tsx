"use server";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";

import DownloadButton from "@/components/DownloadButton";
import EllipsisWithTooltip from "@/components/EllipsisWithTooltip";
import CopyButton from "@/components/CopyButton";
import Icon from "../Icon";
import { TIconSVG } from "@/types/icon/general";

interface IconCardProps {
  title: string;
  description?: string | null;
  svgIcon: React.ReactNode;
  category?: string | null;
}

const IconCard = async ({
  title,
  description,
  svgIcon,
  category,
}: IconCardProps) => {
  const safeDescription = description ?? "N/A";
  const safeCategory = category ?? "N/A";

  return (
    <Card className="flex flex-col justify-between w-full h-full">
      <CardHeader className="space-y-2 flex-1">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-muted-foreground">
            Name
          </span>
          <EllipsisWithTooltip text={title} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-muted-foreground">
            Description
          </span>
          <EllipsisWithTooltip text={safeDescription} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-muted-foreground">
            Category
          </span>
          <EllipsisWithTooltip text={safeCategory} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col justify-between items-center grow">
        <Icon svgIcon={svgIcon as TIconSVG} />
      </CardContent>

      <CardFooter className="border-t">
        {/* TODO: Add like button */}
        <div className="flex gap-2">
          <CopyButton svgIcon={svgIcon} />
          <DownloadButton svgIcon={svgIcon} title={title} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default IconCard;
