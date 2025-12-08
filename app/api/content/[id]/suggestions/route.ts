import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid content ID' },
        { status: 400 }
      );
    }

    const currentContent = await prisma.content.findUnique({
      where: { id },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    if (!currentContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    const genreIds = currentContent.genres.map(cg => cg.genreId);

    const suggestions = await prisma.content.findMany({
      where: {
        AND: [
          { id: { not: id } },
          {
            genres: {
              some: {
                genreId: {
                  in: genreIds,
                },
              },
            },
          },
        ],
      },
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
      take: 10,
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}
