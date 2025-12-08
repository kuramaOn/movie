import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Detect video source
    const videoType = detectVideoSource(url);
    
    let metadata: any = {};

    switch (videoType) {
      case 'youtube':
        metadata = await extractYouTubeMetadata(url);
        break;
      case 'vimeo':
        metadata = await extractVimeoMetadata(url);
        break;
      case 'dailymotion':
        metadata = await extractDailymotionMetadata(url);
        break;
      default:
        metadata = await extractGenericMetadata(url);
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Metadata extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract metadata' },
      { status: 500 }
    );
  }
}

// Detect video source from URL
function detectVideoSource(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  if (url.includes('dailymotion.com')) {
    return 'dailymotion';
  }
  return 'generic';
}

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Extract Vimeo video ID from URL
function getVimeoVideoId(url: string): string | null {
  const regex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:|\/\?)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// YouTube Metadata Extraction
async function extractYouTubeMetadata(url: string) {
  const videoId = getYouTubeVideoId(url);
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  // Method 1: Using YouTube oEmbed API (No API key needed)
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    const data = await response.json();

    return {
      title: data.title,
      description: data.title || 'Watch this video on YouTube',
      thumbnail_url: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: null,
      author: data.author_name
    };
  } catch (error) {
    console.error('oEmbed method failed, trying alternative...');
  }

  // Method 2: Using YouTube Data API (requires API key)
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (apiKey) {
    try {
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        return {
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail_url: video.snippet.thumbnails.maxres?.url || 
                        video.snippet.thumbnails.high?.url || 
                        video.snippet.thumbnails.default?.url,
          duration: parseDuration(video.contentDetails.duration),
          author: video.snippet.channelTitle
        };
      }
    } catch (error) {
      console.error('YouTube API method failed:', error);
    }
  }

  // Fallback: Basic info
  return {
    title: 'YouTube Video',
    description: 'Please add description manually',
    thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    duration: null
  };
}

// Vimeo Metadata Extraction
async function extractVimeoMetadata(url: string) {
  const videoId = getVimeoVideoId(url);
  
  if (!videoId) {
    throw new Error('Invalid Vimeo URL');
  }

  // Method 1: Vimeo oEmbed API (No token needed)
  try {
    const oembedUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`;
    const response = await fetch(oembedUrl);
    const data = await response.json();

    return {
      title: data.title,
      description: data.description || data.title || 'Watch this video on Vimeo',
      thumbnail_url: data.thumbnail_url,
      duration: data.duration ? Math.floor(data.duration / 60) : null,
      author: data.author_name
    };
  } catch (error) {
    console.error('Vimeo oEmbed failed, trying API...');
  }

  // Method 2: Vimeo API (requires access token)
  const accessToken = process.env.VIMEO_ACCESS_TOKEN;
  
  if (accessToken) {
    try {
      const apiUrl = `https://api.vimeo.com/videos/${videoId}`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();

      return {
        title: data.name,
        description: data.description,
        thumbnail_url: data.pictures?.sizes[data.pictures.sizes.length - 1]?.link,
        duration: data.duration ? Math.floor(data.duration / 60) : null,
        author: data.user?.name
      };
    } catch (error) {
      console.error('Vimeo API method failed:', error);
    }
  }

  // Fallback
  return {
    title: 'Vimeo Video',
    description: 'Please add description manually',
    thumbnail_url: null,
    duration: null
  };
}

// Extract Dailymotion video ID
function getDailymotionVideoId(url: string): string | null {
  const match = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

// Dailymotion Metadata Extraction (Fixed)
async function extractDailymotionMetadata(url: string) {
  const videoId = getDailymotionVideoId(url);
  
  if (!videoId) {
    throw new Error('Invalid Dailymotion URL');
  }
  
  try {
    const apiUrl = `https://api.dailymotion.com/video/${videoId}?fields=title,description,thumbnail_large_url,duration,owner.screenname`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    return {
      title: data.title || 'Dailymotion Video',
      description: data.description || 'Watch this video on Dailymotion',
      thumbnail_url: data.thumbnail_large_url,
      duration: data.duration ? Math.floor(data.duration / 60) : null,
      author: data['owner.screenname']
    };
  } catch (error) {
    console.error('Dailymotion extraction failed:', error);
    
    // Fallback with basic info
    return {
      title: 'Dailymotion Video',
      description: 'Please add description manually',
      thumbnail_url: `https://www.dailymotion.com/thumbnail/video/${videoId}`,
      duration: null
    };
  }
}

// Generic metadata extraction
async function extractGenericMetadata(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await response.text();

    const title = extractMetaTag(html, 'og:title') || extractMetaTag(html, 'twitter:title') || 'Video';
    const description = extractMetaTag(html, 'og:description') || extractMetaTag(html, 'twitter:description') || 'Please add description manually';
    const thumbnail = extractMetaTag(html, 'og:image') || extractMetaTag(html, 'twitter:image');

    return {
      title,
      description,
      thumbnail_url: thumbnail,
      duration: null,
      author: null
    };
  } catch (error) {
    console.error('Generic extraction failed:', error);
    return {
      title: 'Video',
      description: 'Please add description manually',
      thumbnail_url: null,
      duration: null
    };
  }
}

// Helper function to extract meta tags from HTML
function extractMetaTag(html: string, property: string): string | null {
  const regex = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  if (match) return match[1];

  const nameRegex = new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
  const nameMatch = html.match(nameRegex);
  return nameMatch ? nameMatch[1] : null;
}

// Parse YouTube duration format (PT1H2M10S) to minutes
function parseDuration(duration: string): number | null {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 60 + minutes + Math.round(seconds / 60);
}
