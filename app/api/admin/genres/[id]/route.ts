import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid genre ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, slug } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const genreSlug = slug || slugify(name);

    const genre = await prisma.genre.update({
      where: { id },
      data: {
        name,
        slug: genreSlug,
      },
    });

    return NextResponse.json(genre);
  } catch (error: any) {
    console.error('Error updating genre:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Genre with this name or slug already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update genre' },
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
        { error: 'Invalid genre ID' },
        { status: 400 }
      );
    }

    await prisma.genre.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting genre:', error);
    return NextResponse.json(
      { error: 'Failed to delete genre' },
      { status: 500 }
    );
  }
}
