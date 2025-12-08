import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const [content, total] = await Promise.all([
      prisma.content.findMany({
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.content.count(),
    ]);

    return NextResponse.json({ content, total });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      type,
      videoUrl,
      thumbnailUrl,
      year,
      duration,
      rating,
      cast,
      genreIds,
    } = body;

    if (!title || !type || !videoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, videoUrl' },
        { status: 400 }
      );
    }

    if (type !== 'movie' && type !== 'documentary') {
      return NextResponse.json(
        { error: 'Invalid type. Must be "movie" or "documentary"' },
        { status: 400 }
      );
    }

    const content = await prisma.content.create({
      data: {
        title,
        description,
        type,
        videoUrl,
        thumbnailUrl,
        year,
        duration,
        rating,
        cast: cast ? JSON.stringify(cast) : null,
        genres: genreIds && genreIds.length > 0 ? {
          create: genreIds.map((genreId: number) => ({
            genre: {
              connect: { id: genreId },
            },
          })),
        } : undefined,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
