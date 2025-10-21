import { TUserId } from "../general";
import { PaginationParams, PaginatedResponse } from "@/types/loadMore/server";

export interface GetAllIconsParams extends PaginationParams {
  search?: string;
  isLiked?: boolean;
  category?: string;
}

export type TIconSVG = string;

export interface IIcon {
  id: string;
  title: string;
  description: string | null;
  svgIcon: TIconSVG;
  category: string | null;
  liked: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: TUserId;
}

// Use standardized response format
export type GetAllIconsResponse = PaginatedResponse<IIcon>;
