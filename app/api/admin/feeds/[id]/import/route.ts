import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid feed ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { selectedItems, defaultGenreIds, defaultType } = body;

    if (!selectedItems || !Array.isArray(selectedItems)) {
      return NextResponse.json(
        { error: 'selectedItems must be an array' },
        { status: 400 }
      );
    }

    const feed = await prisma.feedSource.findUnique({
      where: { id },
    });

    if (!feed) {
      return NextResponse.json(
        { error: 'Feed not found' },
        { status: 404 }
      );
    }

    const imported = [];
    const errors = [];

    for (const item of selectedItems) {
      try {
        // Check if content already exists
        const existing = await prisma.content.findFirst({
          where: { videoUrl: item.videoUrl },
        });

        if (existing) {
          errors.push({
            title: item.title,
            error: 'Content already exists',
          });
          continue;
        }

        const content = await prisma.content.create({
          data: {
            title: item.title,
            description: item.description,
            type: item.type || defaultType || 'movie',
            videoUrl: item.videoUrl,
            thumbnailUrl: item.thumbnailUrl,
            duration: item.duration,
            feedSourceId: id,
            genres: defaultGenreIds && defaultGenreIds.length > 0 ? {
              create: defaultGenreIds.map((genreId: number) => ({
                genre: {
                  connect: { id: genreId },
                },
              })),
            } : undefined,
          },
        });

        imported.push(content);
      } catch (error: any) {
        console.error(`Error importing item ${item.title}:`, error);
        errors.push({
          title: item.title,
          error: error.message || 'Failed to import',
        });
      }
    }

    // Update feed last synced time
    await prisma.feedSource.update({
      where: { id },
      data: { lastSynced: new Date() },
    });

    // Create sync log
    await prisma.syncLog.create({
      data: {
        feedSourceId: id,
        status: errors.length === 0 ? 'success' : 'error',
        itemsFound: selectedItems.length,
        itemsImported: imported.length,
        errorMessage: errors.length > 0 ? JSON.stringify(errors) : null,
      },
    });

    return NextResponse.json({
      success: true,
      imported: imported.length,
      errors: errors.length,
      details: { imported, errors },
    });
  } catch (error) {
    console.error('Error importing feed items:', error);
    return NextResponse.json(
      { error: 'Failed to import feed items' },
      { status: 500 }
    );
  }
}
