import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export interface ParsedVideo {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: number;
  publishedAt?: Date;
}

export async function parseRSSFeed(url: string): Promise<ParsedVideo[]> {
  try {
    const response = await axios.get(url);
    const xmlData = response.data;
    const parsed = await parseStringPromise(xmlData);
    
    const videos: ParsedVideo[] = [];
    
    // Handle RSS 2.0
    if (parsed.rss?.channel?.[0]?.item) {
      const items = parsed.rss.channel[0].item;
      for (const item of items) {
        const video: ParsedVideo = {
          title: item.title?.[0] || 'Untitled',
          description: item.description?.[0] || '',
          videoUrl: '',
          thumbnailUrl: '',
        };
        
        // Try to get video URL from enclosure or media:content
        if (item.enclosure?.[0]?.$?.url) {
          video.videoUrl = item.enclosure[0].$.url;
        } else if (item['media:content']?.[0]?.$?.url) {
          video.videoUrl = item['media:content'][0].$.url;
        }
        
        // Try to get thumbnail from media:thumbnail
        if (item['media:thumbnail']?.[0]?.$?.url) {
          video.thumbnailUrl = item['media:thumbnail'][0].$.url;
        }
        
        // Try to get published date
        if (item.pubDate?.[0]) {
          video.publishedAt = new Date(item.pubDate[0]);
        }
        
        if (video.videoUrl) {
          videos.push(video);
        }
      }
    }
    
    // Handle Atom feeds
    if (parsed.feed?.entry) {
      const entries = parsed.feed.entry;
      for (const entry of entries) {
        const video: ParsedVideo = {
          title: entry.title?.[0]?._ || entry.title?.[0] || 'Untitled',
          description: entry.summary?.[0]?._ || entry.summary?.[0] || '',
          videoUrl: '',
          thumbnailUrl: '',
        };
        
        // Try to get video URL from link
        if (entry.link) {
          const videoLink = entry.link.find((l: any) => l.$?.type?.includes('video'));
          if (videoLink?.$?.href) {
            video.videoUrl = videoLink.$.href;
          }
        }
        
        if (video.videoUrl) {
          videos.push(video);
        }
      }
    }
    
    return videos;
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
    
    return videos;
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
