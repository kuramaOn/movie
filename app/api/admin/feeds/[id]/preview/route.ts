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

    console.log(`[Preview] Fetching feed with ID: ${id}`);
    
    const feed = await prisma.feedSource.findUnique({
      where: { id },
    });

    if (!feed) {
      console.log(`[Preview] Feed not found with ID: ${id}`);
      return NextResponse.json(
        { error: 'Feed not found' },
        { status: 404 }
      );
    }

    console.log(`[Preview] Found feed: ${feed.name} (${feed.type})`);
    console.log(`[Preview] Feed URL: ${feed.url}`);

    let videos;

    try {
      console.log(`[Preview] Starting to parse feed...`);
      
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

      console.log(`[Preview] Successfully parsed ${videos.length} videos`);
      
      return NextResponse.json({
        feedName: feed.name,
        feedType: feed.type,
        feedUrl: feed.url,
        videos,
        count: videos.length,
      });
    } catch (parseError: any) {
      console.error('[Preview] Error parsing feed:', parseError);
      
      return NextResponse.json(
        { 
          error: parseError.message || 'Failed to parse feed',
          feedName: feed.name,
          feedType: feed.type,
          feedUrl: feed.url,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Preview] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to preview feed' },
      { status: 500 }
    );
  }
}
