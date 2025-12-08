export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function detectVideoSource(url: string): 'youtube' | 'vimeo' | 'direct' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'direct';
}

export function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

export function getVimeoVideoId(url: string): string | null {
  const regExp = /vimeo\.com\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// LocalStorage helpers for continue watching
export const WATCH_STORAGE_KEY = 'netchannel_watch_';

export function saveWatchProgress(contentId: number, position: number, duration: number) {
  if (typeof window === 'undefined') return;
  
  const progress = {
    position,
    duration,
    timestamp: Date.now(),
    completed: position / duration > 0.9,
  };
  
  localStorage.setItem(`${WATCH_STORAGE_KEY}${contentId}`, JSON.stringify(progress));
}

export function getWatchProgress(contentId: number): { position: number; duration: number; completed: boolean } | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(`${WATCH_STORAGE_KEY}${contentId}`);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function clearWatchProgress(contentId: number) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${WATCH_STORAGE_KEY}${contentId}`);
}

export function getAllWatchProgress(): Array<{ contentId: number; position: number; duration: number }> {
  if (typeof window === 'undefined') return [];
  
  const watching: Array<{ contentId: number; position: number; duration: number }> = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(WATCH_STORAGE_KEY)) {
      const contentId = parseInt(key.replace(WATCH_STORAGE_KEY, ''));
      const data = localStorage.getItem(key);
      
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (!parsed.completed) {
            watching.push({
              contentId,
              position: parsed.position,
              duration: parsed.duration,
            });
          }
        } catch {
          // Skip invalid entries
        }
      }
    }
  }
  
  return watching;
}
