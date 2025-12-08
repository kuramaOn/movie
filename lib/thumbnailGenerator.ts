// Automatic Thumbnail Generation for Videos
import axios from 'axios';

export interface ThumbnailResult {
  thumbnailUrl: string;
  method: string;
}

/**
 * Generate or extract thumbnail from video URL
 */
export async function generateThumbnail(videoUrl: string): Promise<string> {
  try {
    // 1. Try to extract from video platform
    const platformThumb = await extractPlatformThumbnail(videoUrl);
    if (platformThumb) {
      console.log(`✓ Thumbnail found via platform for: ${videoUrl}`);
      return platformThumb;
    }

    // 2. Try to generate from direct video URL
    const directThumb = await generateFromDirectUrl(videoUrl);
    if (directThumb) {
      console.log(`✓ Thumbnail found via direct URL for: ${videoUrl}`);
      return directThumb;
    }

    // 3. Try to extract from page
    const ogImage = await extractOGImageFromPage(videoUrl);
    if (ogImage) {
      console.log(`✓ Thumbnail found via OG image for: ${videoUrl}`);
      return ogImage;
    }

    // 4. Use placeholder
    console.log(`⚠ No thumbnail found, using placeholder for: ${videoUrl}`);
    return '/placeholder-thumbnail.jpg';
  } catch (error) {
    console.error(`✗ Error generating thumbnail for ${videoUrl}:`, error);
    return '/placeholder-thumbnail.jpg';
  }
}

/**
 * Extract thumbnail from video platforms (YouTube, Vimeo, Dailymotion, etc.)
 */
async function extractPlatformThumbnail(url: string): Promise<string | null> {
  try {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      // Try maxresdefault first, fallback to hqdefault
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      try {
        const response = await axios.get(`https://vimeo.com/api/v2/video/${videoId}.json`);
        return response.data[0]?.thumbnail_large || response.data[0]?.thumbnail_medium;
      } catch (error) {
        console.error('Vimeo thumbnail extraction failed:', error);
      }
    }

    // Dailymotion
    const dailymotionMatch = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
    if (dailymotionMatch) {
      const videoId = dailymotionMatch[1];
      return `https://www.dailymotion.com/thumbnail/video/${videoId}`;
    }

    // Wistia
    const wistiaMatch = url.match(/wistia\.com\/medias\/([a-zA-Z0-9]+)/);
    if (wistiaMatch) {
      const videoId = wistiaMatch[1];
      return `https://embed-ssl.wistia.com/deliveries/${videoId}/file.jpg`;
    }

    // Twitch
    const twitchMatch = url.match(/twitch\.tv\/videos\/(\d+)/);
    if (twitchMatch) {
      const videoId = twitchMatch[1];
      return `https://static-cdn.jtvnw.net/cf_vods/${videoId}/thumb/thumb0.jpg`;
    }

  } catch (error) {
    console.error('Platform thumbnail extraction error:', error);
  }

  return null;
}

/**
 * Generate thumbnail from direct video URL using various methods
 */
async function generateFromDirectUrl(url: string): Promise<string | null> {
  try {
    // Check if it's a direct video file
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    const hasVideoExtension = videoExtensions.some(ext => url.toLowerCase().includes(ext));

    if (!hasVideoExtension) return null;

    // Method 1: Look for poster/thumbnail in same directory
    const posterUrls = [
      url.replace(/\.(mp4|webm|ogg|mov|avi|mkv)$/i, '-poster.jpg'),
      url.replace(/\.(mp4|webm|ogg|mov|avi|mkv)$/i, '-thumb.jpg'),
      url.replace(/\.(mp4|webm|ogg|mov|avi|mkv)$/i, '.jpg'),
      url.replace(/\.(mp4|webm|ogg|mov|avi|mkv)$/i, '.png'),
    ];

    for (const posterUrl of posterUrls) {
      try {
        const response = await axios.head(posterUrl, { timeout: 3000 });
        if (response.status === 200) {
          return posterUrl;
        }
      } catch {
        // Continue to next URL
      }
    }

    // Method 2: Look for thumbnail in parent directory
    const pathParts = url.split('/');
    const filename = pathParts[pathParts.length - 1];
    const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
    const parentPath = pathParts.slice(0, -1).join('/');

    const parentThumbs = [
      `${parentPath}/thumbnails/${nameWithoutExt}.jpg`,
      `${parentPath}/thumbs/${nameWithoutExt}.jpg`,
      `${parentPath}/images/${nameWithoutExt}.jpg`,
    ];

    for (const thumbUrl of parentThumbs) {
      try {
        const response = await axios.head(thumbUrl, { timeout: 3000 });
        if (response.status === 200) {
          return thumbUrl;
        }
      } catch {
        // Continue to next URL
      }
    }

  } catch (error) {
    console.error('Direct URL thumbnail generation error:', error);
  }

  return null;
}

/**
 * Extract thumbnail from Open Graph meta tags
 */
export async function extractOGImageFromPage(pageUrl: string): Promise<string | null> {
  try {
    const response = await axios.get(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 5000
    });

    const html = response.data;

    // Extract og:image
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    if (ogImageMatch) return ogImageMatch[1];

    // Extract twitter:image
    const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
    if (twitterImageMatch) return twitterImageMatch[1];

    // Extract first large image in content
    const imgMatch = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
    if (imgMatch) return imgMatch[1];

  } catch (error) {
    console.error('OG image extraction error:', error);
  }

  return null;
}

/**
 * Fallback: Create a colored placeholder based on title
 */
export function generateColorPlaceholder(title: string): string {
  // Generate a consistent color based on title hash
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#e50914', // Netflix red
    '#0080ff', // Blue
    '#00c853', // Green
    '#ff6d00', // Orange
    '#aa00ff', // Purple
    '#00bfa5', // Teal
  ];
  
  const color = colors[Math.abs(hash) % colors.length];
  
  // Return a data URL with SVG
  const svg = `
    <svg width="300" height="450" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="450" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" 
            text-anchor="middle" dominant-baseline="middle" opacity="0.8">
        ${title.slice(0, 20)}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
