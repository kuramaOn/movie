import { NextRequest, NextResponse } from 'next/server';
import { generateThumbnail, extractOGImageFromPage, generateColorPlaceholder } from '@/lib/thumbnailGenerator';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { videoUrl, title, method } = await request.json();

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    let thumbnailUrl = '';

    switch (method) {
      case 'auto':
        // Automatic detection
        thumbnailUrl = await generateThumbnail(videoUrl);
        break;

      case 'og':
        // Extract from Open Graph meta tags
        const ogImage = await extractOGImageFromPage(videoUrl);
        thumbnailUrl = ogImage || '/placeholder-thumbnail.jpg';
        break;

      case 'placeholder':
        // Generate colored placeholder
        thumbnailUrl = generateColorPlaceholder(title || 'Video');
        break;

      default:
        thumbnailUrl = await generateThumbnail(videoUrl);
    }

    return NextResponse.json({ 
      thumbnailUrl,
      success: true 
    });
  } catch (error: any) {
    console.error('Thumbnail generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate thumbnail', message: error.message },
      { status: 500 }
    );
  }
}
