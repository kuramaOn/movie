import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const feeds = await prisma.feedSource.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(feeds);
  } catch (error) {
    console.error('Error fetching feeds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feeds' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      url,
      type,
      apiKey,
      autoSync,
      syncInterval,
    } = body;

    if (!name || !url || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, url, type' },
        { status: 400 }
      );
    }

    const validTypes = ['rss', 'json_api', 'youtube_channel', 'youtube_playlist', 'vimeo'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid feed type' },
        { status: 400 }
      );
    }

    const feed = await prisma.feedSource.create({
      data: {
        name,
        url,
        type,
        apiKey,
        autoSync: autoSync || false,
        syncInterval: syncInterval || 24,
      },
    });

    return NextResponse.json(feed, { status: 201 });
  } catch (error) {
    console.error('Error creating feed:', error);
    return NextResponse.json(
      { error: 'Failed to create feed' },
      { status: 500 }
    );
  }
}
