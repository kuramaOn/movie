import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(
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

    // Delete existing genre associations
    await prisma.contentGenre.deleteMany({
      where: { contentId: id },
    });

    const content = await prisma.content.update({
      where: { id },
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

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await prisma.content.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
