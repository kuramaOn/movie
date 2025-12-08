import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trending = await prisma.content.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: { viewCount: 'desc' },
      take: 10,
    });

    return NextResponse.json(trending);
  } catch (error) {
    console.error('Error fetching trending content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending content' },
      { status: 500 }
    );
  }
}
