import { TUserId } from "../general";
import { PaginationParams } from "@/types/loadMore/server";

export type IconFields = "title" | "description" | "svgIcon" | "category";

export interface GetAllIconsDBParams extends PaginationParams {
  userId: TUserId;
  search?: string;
  isLiked?: boolean;
  category?: string;
}
