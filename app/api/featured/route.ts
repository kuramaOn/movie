import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const featured = await prisma.content.findFirst({
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: [
        { rating: 'desc' },
        { viewCount: 'desc' },
      ],
    });

    return NextResponse.json(featured);
  } catch (error) {
    console.error('Error fetching featured content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured content' },
      { status: 500 }
    );
  }
}
