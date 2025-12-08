import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

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
        // Validate required fields
        if (!item.videoUrl || item.videoUrl.trim() === '') {
          console.error(`❌ Item "${item.title}" has no videoUrl`);
          errors.push({
            title: item.title,
            error: 'Missing video URL',
          });
          continue;
        }

        if (!item.title || item.title.trim() === '') {
          console.error(`❌ Item with videoUrl "${item.videoUrl}" has no title`);
          errors.push({
            title: 'Untitled',
            error: 'Missing title',
          });
          continue;
        }

        // Check if content already exists
        const existing = await prisma.content.findFirst({
          where: { videoUrl: item.videoUrl },
        });

        if (existing) {
          console.log(`⚠ Content already exists: ${item.title}`);
          errors.push({
            title: item.title,
            error: 'Content already exists',
          });
          continue;
        }

        // Ensure thumbnailUrl is not empty string
        const thumbnailUrl = item.thumbnailUrl && item.thumbnailUrl.trim() !== '' 
          ? item.thumbnailUrl 
          : '/placeholder-thumbnail.jpg';

        const content = await prisma.content.create({
          data: {
            title: item.title,
            description: item.description || '',
            type: item.type || defaultType || 'movie',
            videoUrl: item.videoUrl,
            thumbnailUrl: thumbnailUrl,
            duration: item.duration || null,
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

        console.log(`✓ Imported: ${item.title}`);
        imported.push(content);
      } catch (error: any) {
        console.error(`✗ Error importing item "${item.title}":`, error);
        console.error(`   Video URL: ${item.videoUrl}`);
        console.error(`   Error details:`, error.message);
        if (error.code) {
          console.error(`   Error code:`, error.code);
        }
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

    // Log summary
    console.log(`\n📊 Import Summary:`);
    console.log(`   Total items: ${selectedItems.length}`);
    console.log(`   ✓ Imported: ${imported.length}`);
    console.log(`   ✗ Errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log(`\n❌ Error Details:`);
      errors.forEach((err, idx) => {
        console.log(`   ${idx + 1}. "${err.title}": ${err.error}`);
      });
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      errors: errors.length,
      errorDetails: errors,
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
