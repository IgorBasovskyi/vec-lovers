'use server';

import prisma from '@/utils/prisma';
import { handlePrismaError } from '@/utils/general/server';
import { verifySession } from '@/utils/auth/server';
import { redirect } from 'next/navigation';
import { TServerResponse } from '@/types/general/server';
import { unstable_cache } from 'next/cache';
import { GetAllIconsDBParams } from '@/types/icon/server';
import { GetAllIconsParams, GetAllIconsResponse } from '@/types/icon/general';
import { TUserId } from '@/types/general';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '@/constants/general';

// Cached database query function
const getIconsFromDB = async ({
  userId,
  search,
  offset,
  limit,
  isLiked,
  category,
}: GetAllIconsDBParams) => {
  // Build where clause for filtering
  const whereClause: {
    userId: TUserId;
    OR?: Array<{
      title?: { contains: string; mode: 'insensitive' };
      description?: { contains: string; mode: 'insensitive' };
      category?: { contains: string; mode: 'insensitive' };
    }>;
    liked?: boolean;
    category?: { contains: string; mode: 'insensitive' };
  } = {
    userId, // Only get user's own icons
  };

  // Add search functionality
  if (search && search.trim()) {
    whereClause.OR = [
      { title: { contains: search.trim(), mode: 'insensitive' } },
      { description: { contains: search.trim(), mode: 'insensitive' } },
      { category: { contains: search.trim(), mode: 'insensitive' } },
    ];
  }

  // Add isLiked filter
  if (typeof isLiked === 'boolean') {
    whereClause.liked = isLiked;
  }

  // Add category filter
  if (category && category.trim()) {
    whereClause.category = { contains: category.trim(), mode: 'insensitive' };
  }

  // Get total count for pagination
  const total = await prisma.icon.count({
    where: whereClause,
  });

  // Get icons with pagination
  const icons = await prisma.icon.findMany({
    where: whereClause,
    skip: offset,
    take: limit,
    orderBy: [
      { liked: 'desc' }, // Liked icons first
      { createdAt: 'desc' }, // Then by creation date
    ],
    select: {
      id: true,
      title: true,
      description: true,
      svgIcon: true,
      category: true,
      liked: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    },
  });

  return { icons, total };
};

// Cached version of the database query
const getCachedIcons = unstable_cache(
  async (
    userId: string,
    search: string,
    offset: number,
    limit: number,
    isLiked?: boolean,
    category?: string
  ) => {
    return getIconsFromDB({ userId, search, offset, limit, isLiked, category });
  },
  ['icons'],
  {
    tags: ['icons'],
    revalidate: 60, // Cache for 60 seconds
  }
);

export const getAllIconsAction = async (
  params: GetAllIconsParams = {}
): Promise<GetAllIconsResponse | TServerResponse> => {
  const session = await verifySession();

  if (!session || !session.userId) {
    redirect('/login');
  }

  const {
    search = '',
    offset = DEFAULT_OFFSET,
    limit = DEFAULT_LIMIT,
    isLiked,
    category,
  } = params;

  try {
    const { icons, total } = await getCachedIcons(
      session.userId,
      search,
      offset,
      limit,
      isLiked,
      category
    );

    const hasMore = offset + limit < total;

    return {
      data: icons,
      pagination: {
        hasMore,
        total,
      },
    };
  } catch (err) {
    return handlePrismaError(err);
  }
};
