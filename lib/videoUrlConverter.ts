/**
 * Video URL Converter
 * Converts video page URLs to embeddable URLs for different video platforms
 */

export interface VideoSource {
  platform: string;
  isEmbeddable: boolean;
  embedUrl: string;
  originalUrl: string;
  requiresIframe: boolean;
}

/**
 * Convert a video URL to an embeddable format
 */
export const convertToEmbeddableUrl = (url: string): string => {
  if (!url) return '';
  
  const urlLower = url.toLowerCase();
  
  // Direct video files - no conversion needed
  if (url.match(/\.(mp4|webm|ogg|mov|avi|mkv|m3u8)$/i)) {
    return url;
  }
  
  // PornHub
  if (urlLower.includes('pornhub.com')) {
    if (url.includes('/embed/')) return url; // Already embed URL
    
    const viewkeyMatch = url.match(/viewkey=([^&]+)/);
    if (viewkeyMatch) {
      return `https://www.pornhub.com/embed/${viewkeyMatch[1]}`;
    }
    
    // Alternative format: /view_video.php?viewkey=xxx
    const altMatch = url.match(/view_video\.php\?viewkey=([^&]+)/);
    if (altMatch) {
      return `https://www.pornhub.com/embed/${altMatch[1]}`;
    }
  }
  
  // XVideos
  if (urlLower.includes('xvideos.com')) {
    if (url.includes('/embedframe/')) return url; // Already embed
    
    const videoIdMatch = url.match(/video(\d+)/);
    if (videoIdMatch) {
      return `https://www.xvideos.com/embedframe/${videoIdMatch[1]}`;
    }
  }
  
  // XHamster
  if (urlLower.includes('xhamster.com')) {
    if (url.includes('/embed/')) return url; // Already embed
    
    // Format: /videos/title-12345
    const match = url.match(/\/videos\/[^\/]+-(\d+)/);
    if (match) {
      return `https://xhamster.com/embed/${match[1]}`;
    }
    
    // Alternative format: /movies/12345/title
    const altMatch = url.match(/\/movies\/(\d+)/);
    if (altMatch) {
      return `https://xhamster.com/embed/${altMatch[1]}`;
    }
  }
  
  // Redtube
  if (urlLower.includes('redtube.com')) {
    if (url.includes('embed.redtube.com')) return url;
    
    const videoIdMatch = url.match(/\/(\d+)$/);
    if (videoIdMatch) {
      return `https://embed.redtube.com/?id=${videoIdMatch[1]}`;
    }
  }
  
  // YouPorn
  if (urlLower.includes('youporn.com')) {
    if (url.includes('/embed/')) return url;
    
    const videoIdMatch = url.match(/\/watch\/(\d+)/);
    if (videoIdMatch) {
      return `https://www.youporn.com/embed/${videoIdMatch[1]}`;
    }
  }
  
  // Tube8
  if (urlLower.includes('tube8.com')) {
    if (url.includes('/embed/')) return url;
    
    const videoIdMatch = url.match(/\/([^\/]+)\/(\d+)/);
    if (videoIdMatch) {
      return `https://www.tube8.com/embed/${videoIdMatch[1]}/${videoIdMatch[2]}`;
    }
  }
  
  // SpankBang
  if (urlLower.includes('spankbang.com')) {
    if (url.includes('/embed/')) return url;
    
    const videoIdMatch = url.match(/\/([a-z0-9]+)\/video/);
    if (videoIdMatch) {
      return `https://spankbang.com/${videoIdMatch[1]}/embed/`;
    }
  }
  
  // YouTube
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    if (url.includes('/embed/')) return url;
    
    let videoId = '';
    
    // youtu.be format
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    }
    
    // youtube.com format
    const longMatch = url.match(/[?&]v=([^&]+)/);
    if (longMatch) {
      videoId = longMatch[1];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  // Vimeo
  if (urlLower.includes('vimeo.com')) {
    if (url.includes('player.vimeo.com')) return url;
    
    const videoIdMatch = url.match(/vimeo\.com\/(\d+)/);
    if (videoIdMatch) {
      return `https://player.vimeo.com/video/${videoIdMatch[1]}`;
    }
  }
  
  // Dailymotion
  if (urlLower.includes('dailymotion.com')) {
    if (url.includes('/embed/')) return url;
    
    const videoIdMatch = url.match(/\/video\/([^_]+)/);
    if (videoIdMatch) {
      return `https://www.dailymotion.com/embed/video/${videoIdMatch[1]}`;
    }
  }
  
  // Vidoza
  if (urlLower.includes('vidoza.net')) {
    if (url.includes('/embed-')) return url;
    
    const videoIdMatch = url.match(/\/([a-zA-Z0-9]+)\.html/);
    if (videoIdMatch) {
      return `https://vidoza.net/embed-${videoIdMatch[1]}.html`;
    }
  }
  
  // Streamtape
  if (urlLower.includes('streamtape.com')) {
    if (url.includes('/e/')) return url;
    
    const videoIdMatch = url.match(/\/v\/([a-zA-Z0-9]+)/);
    if (videoIdMatch) {
      return `https://streamtape.com/e/${videoIdMatch[1]}`;
    }
  }
  
  // Doodstream
  if (urlLower.includes('doodstream.com') || urlLower.includes('dood.')) {
    if (url.includes('/e/')) return url;
    
    const videoIdMatch = url.match(/\/d\/([a-zA-Z0-9]+)/);
    if (videoIdMatch) {
      return `https://doodstream.com/e/${videoIdMatch[1]}`;
    }
  }
  
  // Mixdrop
  if (urlLower.includes('mixdrop.')) {
    if (url.includes('/e/')) return url;
    
    const videoIdMatch = url.match(/\/f\/([a-zA-Z0-9]+)/);
    if (videoIdMatch) {
      return `https://mixdrop.co/e/${videoIdMatch[1]}`;
    }
  }
  
  // If no conversion rule matches, return original URL
  return url;
};

/**
 * Get detailed information about a video source
 */
export const getVideoSourceInfo = (url: string): VideoSource => {
  const urlLower = url.toLowerCase();
  const embedUrl = convertToEmbeddableUrl(url);
  
  // Determine platform
  let platform = 'Unknown';
  let requiresIframe = true;
  
  if (urlLower.includes('pornhub.com')) platform = 'PornHub';
  else if (urlLower.includes('xvideos.com')) platform = 'XVideos';
  else if (urlLower.includes('xhamster.com')) platform = 'XHamster';
  else if (urlLower.includes('redtube.com')) platform = 'Redtube';
  else if (urlLower.includes('youporn.com')) platform = 'YouPorn';
  else if (urlLower.includes('tube8.com')) platform = 'Tube8';
  else if (urlLower.includes('spankbang.com')) platform = 'SpankBang';
  else if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) platform = 'YouTube';
  else if (urlLower.includes('vimeo.com')) platform = 'Vimeo';
  else if (urlLower.includes('dailymotion.com')) platform = 'Dailymotion';
  else if (urlLower.includes('vidoza.net')) platform = 'Vidoza';
  else if (urlLower.includes('streamtape.com')) platform = 'Streamtape';
  else if (urlLower.includes('doodstream.com') || urlLower.includes('dood.')) platform = 'Doodstream';
  else if (urlLower.includes('mixdrop.')) platform = 'Mixdrop';
  else if (url.match(/\.(mp4|webm|ogg|mov|avi|mkv|m3u8)$/i)) {
    platform = 'Direct Video';
    requiresIframe = false;
  }
  
  return {
    platform,
    isEmbeddable: embedUrl !== url || !requiresIframe,
    embedUrl,
    originalUrl: url,
    requiresIframe,
  };
};

/**
 * Check if a URL is a direct video file
 */
export const isDirectVideoFile = (url: string): boolean => {
  return !!url.match(/\.(mp4|webm|ogg|mov|avi|mkv|m3u8)$/i);
};

/**
 * Extract domain from URL for display
 */
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Unknown';
  }
};
