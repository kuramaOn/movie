// Feed Templates for Quick Setup

export interface FeedTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  type: 'rss' | 'json_api' | 'youtube_channel' | 'youtube_playlist' | 'vimeo';
  urlPattern: string;
  urlPlaceholder: string;
  requiresApiKey: boolean;
  defaultAutoSync: boolean;
  defaultSyncInterval: number;
  exampleUrl: string;
  instructions: string;
  popularGenres: string[];
}

export const FEED_TEMPLATES: FeedTemplate[] = [
  // Adult Content Feeds
  {
    id: 'pornhub-rss',
    name: 'PornHub RSS Feed',
    description: 'Import videos from PornHub RSS feeds',
    category: 'Adult Content',
    icon: '🔞',
    type: 'rss',
    urlPattern: 'https://www.pornhub.com/feeds/*',
    urlPlaceholder: 'https://www.pornhub.com/feeds/videos/recent',
    requiresApiKey: false,
    defaultAutoSync: true,
    defaultSyncInterval: 6,
    exampleUrl: 'https://www.pornhub.com/feeds/videos/recent',
    instructions: 'PornHub offers various RSS feeds. Popular options: /videos/recent, /videos/popular, /videos/featured',
    popularGenres: ['18+', 'Adult', 'Amateur', 'Professional'],
  },
  {
    id: 'xvideos-rss',
    name: 'XVideos RSS Feed',
    description: 'Import videos from XVideos RSS feeds',
    category: 'Adult Content',
    icon: '🔞',
    type: 'rss',
    urlPattern: 'https://www.xvideos.com/feeds/*',
    urlPlaceholder: 'https://www.xvideos.com/feeds/videos/recent',
    requiresApiKey: false,
    defaultAutoSync: true,
    defaultSyncInterval: 6,
    exampleUrl: 'https://www.xvideos.com/feeds/videos/recent',
    instructions: 'XVideos RSS feeds for latest, popular, and trending videos',
    popularGenres: ['18+', 'Adult', 'HD'],
  },
  {
    id: 'xhamster-rss',
    name: 'XHamster RSS Feed',
    description: 'Import videos from XHamster RSS feeds',
    category: 'Adult Content',
    icon: '🔞',
    type: 'rss',
    urlPattern: 'https://xhamster.com/feeds/*',
    urlPlaceholder: 'https://xhamster.com/feeds/videos/recent',
    requiresApiKey: false,
    defaultAutoSync: true,
    defaultSyncInterval: 6,
    exampleUrl: 'https://xhamster.com/feeds/videos/recent',
    instructions: 'XHamster provides RSS feeds for recent uploads and popular content',
    popularGenres: ['18+', 'Adult', 'Amateur'],
  },
  {
    id: 'redtube-rss',
    name: 'RedTube RSS Feed',
    description: 'Import videos from RedTube RSS feeds',
    category: 'Adult Content',
    icon: '🔞',
    type: 'rss',
    urlPattern: 'https://www.redtube.com/feeds/*',
    urlPlaceholder: 'https://www.redtube.com/feeds/videos/recent',
    requiresApiKey: false,
    defaultAutoSync: true,
    defaultSyncInterval: 6,
    exampleUrl: 'https://www.redtube.com/feeds/videos/recent',
    instructions: 'RedTube RSS feeds for recent and popular videos',
    popularGenres: ['18+', 'Adult', 'HD', 'Professional'],
  },
  {
    id: 'youporn-rss',
    name: 'YouPorn RSS Feed',
    description: 'Import videos from YouPorn RSS feeds',
    category: 'Adult Content',
    icon: '🔞',
    type: 'rss',
    urlPattern: 'https://www.youporn.com/feeds/*',
    urlPlaceholder: 'https://www.youporn.com/feeds/videos/recent',
    requiresApiKey: false,
    defaultAutoSync: true,
    defaultSyncInterval: 6,
    exampleUrl: 'https://www.youporn.com/feeds/videos/recent',
    instructions: 'YouPorn RSS feeds for latest uploads',
    popularGenres: ['18+', 'Adult', 'HD'],
  },
  {
    id: 'spankbang-rss',
    name: 'SpankBang RSS Feed',
    description: 'Import videos from SpankBang RSS feeds',
    category: 'Adult Content',
    icon: '🔞',
    type: 'rss',
    urlPattern: 'https://spankbang.com/feeds/*',
    urlPlaceholder: 'https://spankbang.com/feeds/videos/recent',
    requiresApiKey: false,
    defaultAutoSync: true,
    defaultSyncInterval: 6,
    exampleUrl: 'https://spankbang.com/feeds/videos/recent',
    instructions: 'SpankBang RSS feeds for trending videos',
    popularGenres: ['18+', 'Adult', '4K', 'HD'],
  },

  // Video Platforms
  {
    id: 'youtube-channel',
    name: 'YouTube Channel',
    description: 'Import videos from a YouTube channel',
    category: 'Video Platforms',
    icon: '📺',
    type: 'youtube_channel',
    urlPattern: 'https://www.youtube.com/@* or channel ID',
    urlPlaceholder: 'UCxxxxxxxxxxxxxx or @channelname',
    requiresApiKey: true,
    defaultAutoSync: true,
    defaultSyncInterval: 12,
    exampleUrl: '@mkbhd or UCBJycsmduvYEL83R_U4JriQ',
    instructions: 'Requires YouTube Data API v3 key. Get it from Google Cloud Console.',
    popularGenres: ['Video', 'Entertainment', 'Educational'],
  },
  {
    id: 'youtube-playlist',
    name: 'YouTube Playlist',
    description: 'Import videos from a YouTube playlist',
    category: 'Video Platforms',
    icon: '📺',
    type: 'youtube_playlist',
    urlPattern: 'https://www.youtube.com/playlist?list=* or playlist ID',
    urlPlaceholder: 'PLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    requiresApiKey: true,
    defaultAutoSync: true,
    defaultSyncInterval: 24,
    exampleUrl: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    instructions: 'Requires YouTube Data API v3 key. Paste playlist ID or full URL.',
    popularGenres: ['Video', 'Playlist', 'Collection'],
  },
  {
    id: 'vimeo-channel',
    name: 'Vimeo Channel',
    description: 'Import videos from Vimeo',
    category: 'Video Platforms',
    icon: '🎬',
    type: 'vimeo',
    urlPattern: 'https://vimeo.com/channels/* or user ID',
    urlPlaceholder: 'https://vimeo.com/channels/staffpicks',
    requiresApiKey: true,
    defaultAutoSync: true,
    defaultSyncInterval: 24,
    exampleUrl: 'https://vimeo.com/channels/staffpicks',
    instructions: 'Requires Vimeo access token. Get it from Vimeo Developer settings.',
    popularGenres: ['Video', 'Art', 'Short Films'],
  },

  // Generic RSS
  {
    id: 'custom-rss',
    name: 'Custom RSS Feed',
    description: 'Generic RSS feed from any source',
    category: 'Generic',
    icon: '📡',
    type: 'rss',
    urlPattern: 'https://*',
    urlPlaceholder: 'https://example.com/feed.xml',
    requiresApiKey: false,
    defaultAutoSync: true,
    defaultSyncInterval: 24,
    exampleUrl: 'https://example.com/rss/videos.xml',
    instructions: 'Any valid RSS 2.0 or Atom feed with video content',
    popularGenres: ['Video', 'Content'],
  },
  {
    id: 'custom-json',
    name: 'Custom JSON API',
    description: 'Generic JSON API endpoint',
    category: 'Generic',
    icon: '🔧',
    type: 'json_api',
    urlPattern: 'https://*',
    urlPlaceholder: 'https://api.example.com/videos',
    requiresApiKey: false,
    defaultAutoSync: true,
    defaultSyncInterval: 24,
    exampleUrl: 'https://api.example.com/videos.json',
    instructions: 'JSON API that returns an array of video objects',
    popularGenres: ['Video', 'API'],
  },
];

export function getFeedTemplateById(id: string): FeedTemplate | undefined {
  return FEED_TEMPLATES.find(template => template.id === id);
}

export function getFeedTemplatesByCategory(category: string): FeedTemplate[] {
  return FEED_TEMPLATES.filter(template => template.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(FEED_TEMPLATES.map(t => t.category)));
}

export function searchTemplates(query: string): FeedTemplate[] {
  const lowerQuery = query.toLowerCase();
  return FEED_TEMPLATES.filter(
    template =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.category.toLowerCase().includes(lowerQuery)
  );
}
