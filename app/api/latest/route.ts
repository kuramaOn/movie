import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const latest = await prisma.content.findMany({
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json(latest);
  } catch (error) {
    console.error('Error fetching latest content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest content' },
      { status: 500 }
    );
  }
}
