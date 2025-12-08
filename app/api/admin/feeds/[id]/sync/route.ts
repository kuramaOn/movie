import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  parseRSSFeed,
  parseJSONAPI,
  parseYouTubeChannel,
  parseYouTubePlaylist,
  parseVimeo,
} from '@/lib/feedParsers';

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

    const feed = await prisma.feedSource.findUnique({
      where: { id },
    });

    if (!feed) {
      return NextResponse.json(
        { error: 'Feed not found' },
        { status: 404 }
      );
    }

    let videos;

    try {
      console.log(`Syncing feed: ${feed.name} (${feed.type})`);
      console.log(`Feed URL: ${feed.url}`);
      
      switch (feed.type) {
        case 'rss':
          videos = await parseRSSFeed(feed.url);
          break;
        case 'json_api':
          videos = await parseJSONAPI(feed.url);
          break;
        case 'youtube_channel':
          if (!feed.apiKey) {
            throw new Error('YouTube API key required');
          }
          videos = await parseYouTubeChannel(feed.url, feed.apiKey);
          break;
        case 'youtube_playlist':
          if (!feed.apiKey) {
            throw new Error('YouTube API key required');
          }
          videos = await parseYouTubePlaylist(feed.url, feed.apiKey);
          break;
        case 'vimeo':
          if (!feed.apiKey) {
            throw new Error('Vimeo access token required');
          }
          videos = await parseVimeo(feed.url, feed.apiKey);
          break;
        default:
          throw new Error('Unsupported feed type');
      }

      // Import new videos automatically
      const imported = [];
      const errors = [];

      for (const video of videos) {
        try {
          // Check if content already exists
          const existing = await prisma.content.findFirst({
            where: { videoUrl: video.videoUrl },
          });

          if (existing) {
            continue; // Skip existing content
          }

          const content = await prisma.content.create({
            data: {
              title: video.title,
              description: video.description,
              type: 'movie', // Default type for auto-sync
              videoUrl: video.videoUrl,
              thumbnailUrl: video.thumbnailUrl,
              duration: video.duration,
              feedSourceId: id,
            },
          });

          imported.push(content);
        } catch (error: any) {
          console.error(`Error importing video ${video.title}:`, error);
          errors.push({
            title: video.title,
            error: error.message,
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
          itemsFound: videos.length,
          itemsImported: imported.length,
          errorMessage: errors.length > 0 ? JSON.stringify(errors) : null,
        },
      });

      return NextResponse.json({
        success: true,
        itemsFound: videos.length,
        itemsImported: imported.length,
        errors: errors.length,
      });
    } catch (parseError: any) {
      // Log error
      await prisma.syncLog.create({
        data: {
          feedSourceId: id,
          status: 'error',
          itemsFound: 0,
          itemsImported: 0,
          errorMessage: parseError.message,
        },
      });

      return NextResponse.json(
        { error: parseError.message || 'Failed to sync feed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error syncing feed:', error);
    return NextResponse.json(
      { error: 'Failed to sync feed' },
      { status: 500 }
    );
  }
}
