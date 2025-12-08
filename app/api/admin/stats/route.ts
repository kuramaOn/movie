import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      totalContent,
      totalMovies,
      totalDocumentaries,
      totalViewsResult,
      totalFeeds,
      recentUploads,
    ] = await Promise.all([
      prisma.content.count(),
      prisma.content.count({ where: { type: 'movie' } }),
      prisma.content.count({ where: { type: 'documentary' } }),
      prisma.content.aggregate({
        _sum: {
          viewCount: true,
        },
      }),
      prisma.feedSource.count(),
      prisma.content.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
        },
      }),
    ]);

    const totalViews = totalViewsResult._sum.viewCount || 0;

    return NextResponse.json({
      totalContent,
      totalMovies,
      totalDocumentaries,
      totalViews,
      totalFeeds,
      recentUploads,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
