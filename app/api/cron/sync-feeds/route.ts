import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  parseRSSFeed,
  parseJSONAPI,
  parseYouTubeChannel,
  parseYouTubePlaylist,
  parseVimeo,
} from '@/lib/feedParsers';

export async function GET() {
  try {
    // Get all feeds with auto-sync enabled
    const feeds = await prisma.feedSource.findMany({
      where: {
        autoSync: true,
      },
    });

    const results = [];

    for (const feed of feeds) {
      // Check if it's time to sync based on interval
      if (feed.lastSynced) {
        const hoursSinceSync = (Date.now() - feed.lastSynced.getTime()) / (1000 * 60 * 60);
        if (hoursSinceSync < feed.syncInterval) {
          continue; // Skip if not time yet
        }
      }

      try {
        let videos;

        switch (feed.type) {
          case 'rss':
            videos = await parseRSSFeed(feed.url);
            break;
          case 'json_api':
            videos = await parseJSONAPI(feed.url);
            break;
          case 'youtube_channel':
            if (!feed.apiKey) continue;
            videos = await parseYouTubeChannel(feed.url, feed.apiKey);
            break;
          case 'youtube_playlist':
            if (!feed.apiKey) continue;
            videos = await parseYouTubePlaylist(feed.url, feed.apiKey);
            break;
          case 'vimeo':
            if (!feed.apiKey) continue;
            videos = await parseVimeo(feed.url, feed.apiKey);
            break;
          default:
            continue;
        }

        let imported = 0;

        for (const video of videos) {
          try {
            const existing = await prisma.content.findFirst({
              where: { videoUrl: video.videoUrl },
            });

            if (existing) continue;

            await prisma.content.create({
              data: {
                title: video.title,
                description: video.description,
                type: 'movie',
                videoUrl: video.videoUrl,
                thumbnailUrl: video.thumbnailUrl,
                duration: video.duration,
                feedSourceId: feed.id,
              },
            });

            imported++;
          } catch (error) {
            console.error(`Error importing video ${video.title}:`, error);
          }
        }

        await prisma.feedSource.update({
          where: { id: feed.id },
          data: { lastSynced: new Date() },
        });

        await prisma.syncLog.create({
          data: {
            feedSourceId: feed.id,
            status: 'success',
            itemsFound: videos.length,
            itemsImported: imported,
          },
        });

        results.push({
          feedId: feed.id,
          feedName: feed.name,
          itemsFound: videos.length,
          itemsImported: imported,
        });
      } catch (error: any) {
        console.error(`Error syncing feed ${feed.name}:`, error);

        await prisma.syncLog.create({
          data: {
            feedSourceId: feed.id,
            status: 'error',
            itemsFound: 0,
            itemsImported: 0,
            errorMessage: error.message,
          },
        });

        results.push({
          feedId: feed.id,
          feedName: feed.name,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      synced: results.length,
      results,
    });
  } catch (error) {
    console.error('Error in cron sync:', error);
    return NextResponse.json(
      { error: 'Failed to sync feeds' },
      { status: 500 }
    );
  }
}
