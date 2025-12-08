import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Discover RSS feeds from website
    const feeds = await discoverFeeds(url);

    return NextResponse.json({ feeds });
  } catch (error: any) {
    console.error('Feed discovery error:', error);
    return NextResponse.json(
      { error: 'Failed to discover feeds', message: error.message },
      { status: 500 }
    );
  }
}

async function discoverFeeds(url: string) {
  const discoveredFeeds: Array<{ url: string; title: string; type: string }> = [];

  try {
    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Method 1: Look for RSS/Atom link tags in HTML <head>
    $('link[type="application/rss+xml"], link[type="application/atom+xml"], link[type="application/feed+json"]').each((i, elem) => {
      const href = $(elem).attr('href');
      const title = $(elem).attr('title') || 'RSS Feed';
      
      if (href) {
        const feedUrl = new URL(href, url).toString();
        discoveredFeeds.push({
          url: feedUrl,
          title: title,
          type: 'rss'
        });
      }
    });

    // Method 2: Look for common RSS feed URLs
    const commonPaths = [
      '/feed',
      '/rss',
      '/feed.xml',
      '/rss.xml',
      '/atom.xml',
      '/feed/',
      '/feeds',
      '/index.xml',
      '/?feed=rss2',
      '/blog/feed',
      '/blog/rss'
    ];

    for (const path of commonPaths) {
      try {
        const feedUrl = new URL(path, url).toString();
        const exists = await checkFeedExists(feedUrl);
        
        if (exists && !discoveredFeeds.find(f => f.url === feedUrl)) {
          discoveredFeeds.push({
            url: feedUrl,
            title: `RSS Feed (${path})`,
            type: 'rss'
          });
        }
      } catch (err) {
        // Ignore errors for individual paths
      }
    }

    // Method 3: Look for RSS links in the page content
    $('a[href*="rss"], a[href*="feed"], a[href*="atom"]').each((i, elem) => {
      const href = $(elem).attr('href');
      const text = $(elem).text().trim();
      
      if (href && (href.includes('rss') || href.includes('feed') || href.includes('atom'))) {
        try {
          const feedUrl = new URL(href, url).toString();
          if (!discoveredFeeds.find(f => f.url === feedUrl)) {
            discoveredFeeds.push({
              url: feedUrl,
              title: text || 'RSS Feed',
              type: 'rss'
            });
          }
        } catch (err) {
          // Invalid URL
        }
      }
    });

    // Method 4: Check for JSON Feed
    try {
      const jsonFeedUrl = new URL('/feed.json', url).toString();
      const exists = await checkFeedExists(jsonFeedUrl);
      if (exists) {
        discoveredFeeds.push({
          url: jsonFeedUrl,
          title: 'JSON Feed',
          type: 'json_api'
        });
      }
    } catch (err) {
      // Ignore
    }

    return discoveredFeeds;
  } catch (error) {
    console.error('Discovery error:', error);
    throw error;
  }
}

async function checkFeedExists(url: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}
