import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const genreSlug = slug || slugify(name);

    const genre = await prisma.genre.create({
      data: {
        name,
        slug: genreSlug,
      },
    });

    return NextResponse.json(genre, { status: 201 });
  } catch (error: any) {
    console.error('Error creating genre:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Genre with this name or slug already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create genre' },
      { status: 500 }
    );
  }
}
