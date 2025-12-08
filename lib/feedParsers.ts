import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import Parser from 'rss-parser';
import { generateThumbnail, extractOGImageFromPage } from './thumbnailGenerator';

export interface ParsedVideo {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: number;
  publishedAt?: Date;
}

export async function parseRSSFeed(url: string): Promise<ParsedVideo[]> {
  // Validate URL
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid feed URL provided');
  }

  try {
    new URL(url);
  } catch (e) {
    throw new Error(`Invalid URL format: ${url}`);
  }

  const parser = new Parser({
    customFields: {
      item: [
        ['media:content', 'mediaContent'],
        ['media:thumbnail', 'mediaThumbnail'],
        ['enclosure', 'enclosure'],
        ['description', 'description'],
        ['content:encoded', 'contentEncoded']
      ]
    },
    timeout: 15000, // 15 second timeout for Vercel
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*'
    }
  });

  let feed;
  
  try {
    console.log(`[RSS Parser] Fetching feed from: ${url}`);
    feed = await parser.parseURL(url);
    console.log(`[RSS Parser] Successfully fetched feed with ${feed.items?.length || 0} items`);
    
    const videos = feed.items.map(item => {
      // Extract video URL
      let videoUrl = '';
      
      // Try enclosure (podcast-style)
      if (item.enclosure && item.enclosure.url) {
        videoUrl = item.enclosure.url;
      }
      
      // Try media:content
      if (!videoUrl && (item as any).mediaContent) {
        const mediaContent = (item as any).mediaContent;
        if (Array.isArray(mediaContent)) {
          videoUrl = mediaContent[0]?.$ ? mediaContent[0].$.url : mediaContent[0];
        } else {
          videoUrl = mediaContent.$ ? mediaContent.$.url : mediaContent;
        }
      }
      
      // Try to find video URL in content
      if (!videoUrl && (item as any).contentEncoded) {
        const videoMatch = (item as any).contentEncoded.match(/<source[^>]+src=["']([^"']+)["']/i);
        if (videoMatch) videoUrl = videoMatch[1];
      }
      
      // Try to find video URL in description
      if (!videoUrl && item.content) {
        const videoMatch = item.content.match(/(https?:\/\/[^\s]+\.(mp4|webm|ogg|mov))/i);
        if (videoMatch) videoUrl = videoMatch[1];
      }

      // Try link as fallback
      if (!videoUrl && item.link) {
        videoUrl = item.link;
      }

      // Extract thumbnail
      let thumbnailUrl = '';
      
      if ((item as any).mediaThumbnail) {
        const mediaThumbnail = (item as any).mediaThumbnail;
        if (Array.isArray(mediaThumbnail)) {
          thumbnailUrl = mediaThumbnail[0]?.$ ? mediaThumbnail[0].$.url : mediaThumbnail[0];
        } else {
          thumbnailUrl = mediaThumbnail.$ ? mediaThumbnail.$.url : mediaThumbnail;
        }
      }
      
      if (!thumbnailUrl && item.enclosure && item.enclosure.type?.startsWith('image/')) {
        thumbnailUrl = item.enclosure.url;
      }

      // Try to find image in content
      if (!thumbnailUrl && item.content) {
        const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch) thumbnailUrl = imgMatch[1];
      }

      return {
        title: item.title || 'Untitled',
        description: item.contentSnippet || item.content || '',
        videoUrl: videoUrl,
        thumbnailUrl: thumbnailUrl,
        publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
      };
    }).filter(item => item.videoUrl);
    
    // Auto-generate missing thumbnails
    const videosWithThumbnails = await Promise.all(
      videos.map(async (video) => {
        if (!video.thumbnailUrl && video.videoUrl) {
          // Try to generate thumbnail from video URL
          video.thumbnailUrl = await generateThumbnail(video.videoUrl);
        }
        return video;
      })
    );
    
    console.log(`[RSS Parser] Successfully parsed ${videosWithThumbnails.length} videos with valid URLs`);
    return videosWithThumbnails;
  } catch (parseError: any) {
    console.error('[RSS Parser] Primary parser failed, trying fallback method...');
    
    // Fallback: Try fetching with axios and parsing manually
    try {
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        }
      });
      
      console.log('[RSS Parser] Fetched feed with axios, attempting manual parse...');
      
      // Try to parse the XML manually
      const xmlData = response.data;
      feed = await parser.parseString(xmlData);
      console.log(`[RSS Parser] Fallback successful! Parsed ${feed.items?.length || 0} items`);
      
      // Continue with normal processing...
      const videos = feed.items.map(item => {
        let videoUrl = '';
        if (item.enclosure && item.enclosure.url) {
          videoUrl = item.enclosure.url;
        } else if ((item as any).mediaContent) {
          const mediaContent = (item as any).mediaContent;
          if (Array.isArray(mediaContent)) {
            videoUrl = mediaContent[0]?.$ ? mediaContent[0].$.url : mediaContent[0];
          } else {
            videoUrl = mediaContent.$ ? mediaContent.$.url : mediaContent;
          }
        } else if (item.link) {
          videoUrl = item.link;
        }
        
        let thumbnailUrl = '';
        if ((item as any).mediaThumbnail) {
          const mediaThumbnail = (item as any).mediaThumbnail;
          if (Array.isArray(mediaThumbnail)) {
            thumbnailUrl = mediaThumbnail[0]?.$ ? mediaThumbnail[0].$.url : mediaThumbnail[0];
          } else {
            thumbnailUrl = mediaThumbnail.$ ? mediaThumbnail.$.url : mediaThumbnail;
          }
        }
        
        return {
          title: item.title || 'Untitled',
          description: item.contentSnippet || item.content || '',
          videoUrl: videoUrl,
          thumbnailUrl: thumbnailUrl,
          publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
        };
      }).filter(item => item.videoUrl);
      
      return videos;
      
    } catch (fallbackError: any) {
      console.error('[RSS Parser] Fallback method also failed:', fallbackError);
      // Continue with original error handling
    }
    
    const error = parseError;
    
    // Provide more specific error messages
    let errorMessage = 'Unknown error';
    
    if (error.code === 'ENOTFOUND') {
      errorMessage = 'Feed URL not found or DNS resolution failed';
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
      errorMessage = 'Feed request timed out - the server took too long to respond';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Connection refused - the server rejected the connection';
    } else if (error.code === 'CERT_HAS_EXPIRED' || error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
      errorMessage = 'SSL certificate error - the feed URL may have an invalid certificate';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(`Failed to parse RSS feed: ${errorMessage}`);
  }
}

export async function parseJSONAPI(url: string): Promise<ParsedVideo[]> {
  try {
    console.log(`[JSON Parser] Fetching feed from: ${url}`);
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, application/feed+json, */*'
      }
    });
    const data = response.data;
    
    console.log(`[JSON Parser] Successfully fetched data`);
    
    const videos: ParsedVideo[] = [];
    
    // Try common JSON structures
    const items = data.videos || data.items || data.data || data.entries || (Array.isArray(data) ? data : []);
    
    if (!items || items.length === 0) {
      console.log('[JSON Parser] No items found in feed');
      return [];
    }
    
    console.log(`[JSON Parser] Processing ${items.length} items`);
    
    for (const item of items) {
      // Handle different video URL structures
      let videoUrl = item.url || item.video_url || item.videoUrl || item.external_url || item.link || '';
      
      // Handle attachments/enclosures in JSON Feed format
      if (!videoUrl && item.attachments && Array.isArray(item.attachments)) {
        const videoAttachment = item.attachments.find((att: any) => 
          att.mime_type?.startsWith('video/') || att.url?.match(/\.(mp4|webm|ogg|mov)$/i)
        );
        if (videoAttachment) {
          videoUrl = videoAttachment.url;
        }
      }
      
      // Handle thumbnail
      let thumbnailUrl = item.thumbnail || item.thumbnail_url || item.thumbnailUrl || item.image || '';
      
      // Try image field if it's an object
      if (!thumbnailUrl && item.image && typeof item.image === 'object') {
        thumbnailUrl = item.image.url || item.image.src || '';
      }
      
      // Handle banner_image or cover_image
      if (!thumbnailUrl) {
        thumbnailUrl = item.banner_image || item.cover_image || '';
      }
      
      const video: ParsedVideo = {
        title: item.title || item.name || 'Untitled',
        description: item.description || item.summary || item.content_text || item.content_html || '',
        videoUrl: videoUrl,
        thumbnailUrl: thumbnailUrl,
        duration: item.duration || item.duration_in_seconds || undefined,
        publishedAt: item.date_published || item.published || item.pubDate ? new Date(item.date_published || item.published || item.pubDate) : undefined,
      };
      
      if (video.videoUrl) {
        videos.push(video);
      }
    }
    
    // Auto-generate missing thumbnails
    const videosWithThumbnails = await Promise.all(
      videos.map(async (video) => {
        if (!video.thumbnailUrl && video.videoUrl) {
          video.thumbnailUrl = await generateThumbnail(video.videoUrl);
        }
        return video;
      })
    );
    
    console.log(`[JSON Parser] Successfully parsed ${videosWithThumbnails.length} videos`);
    return videosWithThumbnails;
  } catch (error: any) {
    console.error('[JSON Parser] Error:', error);
    const errorMessage = error.message || 'Unknown error';
    throw new Error(`Failed to parse JSON feed: ${errorMessage}`);
  }
}

export async function parseYouTubeChannel(channelId: string, apiKey: string): Promise<ParsedVideo[]> {
  try {
    if (!apiKey) {
      throw new Error('YouTube API key is required');
    }
    
    console.log(`[YouTube Parser] Fetching videos from channel: ${channelId}`);
    
    // Search for videos in the channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&type=video&order=date&key=${apiKey}`;
    const searchResponse = await axios.get(searchUrl, { timeout: 15000 });
    
    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      console.log('[YouTube Parser] No videos found in channel');
      return [];
    }
    
    console.log(`[YouTube Parser] Found ${searchResponse.data.items.length} videos`);
    
    const videos: ParsedVideo[] = [];
    
    for (const item of searchResponse.data.items) {
      const videoId = item.id.videoId;
      
      try {
        // Get video details for duration
        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoId}&key=${apiKey}`;
        const detailsResponse = await axios.get(detailsUrl, { timeout: 15000 });
        
        if (detailsResponse.data.items.length > 0) {
          const videoData = detailsResponse.data.items[0];
          const duration = parseYouTubeDuration(videoData.contentDetails.duration);
          
          videos.push({
            title: item.snippet.title,
            description: item.snippet.description,
            videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
            thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
            duration: duration,
            publishedAt: new Date(item.snippet.publishedAt),
          });
        }
      } catch (videoError) {
        console.error(`[YouTube Parser] Error fetching details for video ${videoId}:`, videoError);
        // Continue with other videos
      }
    }
    
    console.log(`[YouTube Parser] Successfully parsed ${videos.length} videos`);
    return videos;
  } catch (error: any) {
    console.error('[YouTube Parser] Error:', error);
    let errorMessage = error.message || 'Unknown error';
    
    if (error.response?.status === 403) {
      errorMessage = 'Invalid or expired YouTube API key';
    } else if (error.response?.status === 404) {
      errorMessage = 'YouTube channel not found';
    } else if (error.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    }
    
    throw new Error(`Failed to parse YouTube channel: ${errorMessage}`);
  }
}

export async function parseYouTubePlaylist(playlistId: string, apiKey: string): Promise<ParsedVideo[]> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;
    const response = await axios.get(url);
    
    const videos: ParsedVideo[] = [];
    
    for (const item of response.data.items) {
      const videoId = item.snippet.resourceId.videoId;
      
      // Get video details for duration
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`;
      const detailsResponse = await axios.get(detailsUrl);
      
      let duration = undefined;
      if (detailsResponse.data.items.length > 0) {
        duration = parseYouTubeDuration(detailsResponse.data.items[0].contentDetails.duration);
      }
      
      videos.push({
        title: item.snippet.title,
        description: item.snippet.description,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        duration: duration,
        publishedAt: new Date(item.snippet.publishedAt),
      });
    }
    
    return videos;
  } catch (error) {
    console.error('Error parsing YouTube playlist:', error);
    throw new Error('Failed to parse YouTube playlist');
  }
}

export async function parseVimeo(userId: string, accessToken: string): Promise<ParsedVideo[]> {
  try {
    const url = `https://api.vimeo.com/users/${userId}/videos?per_page=50`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `bearer ${accessToken}`,
      },
    });
    
    const videos: ParsedVideo[] = [];
    
    for (const item of response.data.data) {
      videos.push({
        title: item.name,
        description: item.description || '',
        videoUrl: item.link,
        thumbnailUrl: item.pictures?.sizes?.[3]?.link || item.pictures?.base_link || '',
        duration: Math.floor(item.duration / 60), // Convert seconds to minutes
        publishedAt: new Date(item.created_time),
      });
    }
    
    return videos;
  } catch (error) {
    console.error('Error parsing Vimeo:', error);
    throw new Error('Failed to parse Vimeo');
  }
}

function parseYouTubeDuration(duration: string): number {
  // Parse ISO 8601 duration (e.g., PT1H2M10S)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 60 + minutes + Math.ceil(seconds / 60);
}
