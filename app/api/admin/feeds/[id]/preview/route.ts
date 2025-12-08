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
      switch (feed.type) {
        case 'rss':
          videos = await parseRSSFeed(feed.url);
          break;
        case 'json_api':
          videos = await parseJSONAPI(feed.url);
          break;
        case 'youtube_channel':
          if (!feed.apiKey) {
            return NextResponse.json(
              { error: 'YouTube API key required' },
              { status: 400 }
            );
          }
          videos = await parseYouTubeChannel(feed.url, feed.apiKey);
          break;
        case 'youtube_playlist':
          if (!feed.apiKey) {
            return NextResponse.json(
              { error: 'YouTube API key required' },
              { status: 400 }
            );
          }
          videos = await parseYouTubePlaylist(feed.url, feed.apiKey);
          break;
        case 'vimeo':
          if (!feed.apiKey) {
            return NextResponse.json(
              { error: 'Vimeo access token required' },
              { status: 400 }
            );
          }
          videos = await parseVimeo(feed.url, feed.apiKey);
          break;
        default:
          return NextResponse.json(
            { error: 'Unsupported feed type' },
            { status: 400 }
          );
      }

      return NextResponse.json({
        feedName: feed.name,
        videos,
        count: videos.length,
      });
    } catch (parseError: any) {
      console.error('Error parsing feed:', parseError);
      return NextResponse.json(
        { error: parseError.message || 'Failed to parse feed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error previewing feed:', error);
    return NextResponse.json(
      { error: 'Failed to preview feed' },
      { status: 500 }
    );
  }
}
