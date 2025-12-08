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
  const parser = new Parser({
    customFields: {
      item: [
        ['media:content', 'mediaContent'],
        ['media:thumbnail', 'mediaThumbnail'],
        ['enclosure', 'enclosure'],
        ['description', 'description'],
        ['content:encoded', 'contentEncoded']
      ]
    }
  });

  try {
    const feed = await parser.parseURL(url);
    
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
    
    return videosWithThumbnails;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    throw new Error('Failed to parse RSS feed');
  }
}

export async function parseJSONAPI(url: string): Promise<ParsedVideo[]> {
  try {
    const response = await axios.get(url);
    const data = response.data;
    
    const videos: ParsedVideo[] = [];
    
    // Try common JSON structures
    const items = data.videos || data.items || data.data || (Array.isArray(data) ? data : []);
    
    for (const item of items) {
      const video: ParsedVideo = {
        title: item.title || item.name || 'Untitled',
        description: item.description || item.summary || '',
        videoUrl: item.url || item.video_url || item.videoUrl || '',
        thumbnailUrl: item.thumbnail || item.thumbnail_url || item.thumbnailUrl || item.image || '',
        duration: item.duration || undefined,
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
    
    return videosWithThumbnails;
  } catch (error) {
    console.error('Error parsing JSON API:', error);
    throw new Error('Failed to parse JSON API');
  }
}

export async function parseYouTubeChannel(channelId: string, apiKey: string): Promise<ParsedVideo[]> {
  try {
    // Search for videos in the channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&type=video&order=date&key=${apiKey}`;
    const searchResponse = await axios.get(searchUrl);
    
    const videos: ParsedVideo[] = [];
    
    for (const item of searchResponse.data.items) {
      const videoId = item.id.videoId;
      
      // Get video details for duration
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoId}&key=${apiKey}`;
      const detailsResponse = await axios.get(detailsUrl);
      
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
    }
    
    return videos;
  } catch (error) {
    console.error('Error parsing YouTube channel:', error);
    throw new Error('Failed to parse YouTube channel');
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
