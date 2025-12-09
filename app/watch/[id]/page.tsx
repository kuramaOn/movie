import { notFound } from 'next/navigation';
import EnhancedVideoPlayer from '@/components/EnhancedVideoPlayer';
import RelatedVideos from '@/components/RelatedVideos';
import ContentCard from '@/components/ContentCard';
import prisma from '@/lib/db';
import { StarIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { formatDuration } from '@/lib/utils';

async function getContent(id: number) {
  const content = await prisma.content.findUnique({
    where: { id },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });
  return content;
}

async function getSuggestions(contentId: number) {
  const currentContent = await prisma.content.findUnique({
    where: { id: contentId },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });

  if (!currentContent) return [];

  const genreIds = currentContent.genres.map(cg => cg.genreId);

  const suggestions = await prisma.content.findMany({
    where: {
      AND: [
        { id: { not: contentId } },
        {
          genres: {
            some: {
              genreId: {
                in: genreIds,
              },
            },
          },
        },
      ],
    },
    orderBy: [
      { rating: 'desc' },
      { viewCount: 'desc' },
    ],
    take: 10,
  });

  return suggestions;
}

export default async function WatchPage({ params }: { params: { id: string } }) {
  const contentId = parseInt(params.id);
  
  if (isNaN(contentId)) {
    notFound();
  }

  const [content, suggestions] = await Promise.all([
    getContent(contentId),
    getSuggestions(contentId),
  ]);

  if (!content) {
    notFound();
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Video Player */}
      <div className="w-full animate-fade-in">
        <EnhancedVideoPlayer 
          url={content.videoUrl} 
          title={content.title}
          autoPlay={false}
        />
      </div>

      {/* Content Details */}
      <div className="px-4 md:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content info */}
            <div className="lg:col-span-2 space-y-4 animate-fade-in-up">
              <h1 className="text-3xl md:text-4xl font-bold">{content.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {content.rating && (
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">{typeof content.rating === 'object' ? content.rating.toNumber() : content.rating}</span>
                  </div>
                )}
                {content.year && (
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <span>{content.year}</span>
                  </div>
                )}
                {content.duration && (
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <span>{formatDuration(content.duration)}</span>
                  </div>
                )}
                <span className="bg-netflix-red px-3 py-1 rounded text-xs font-semibold">
                  {content.type.toUpperCase()}
                </span>
              </div>

              {content.description && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Description</h2>
                  <p className="text-gray-300 leading-relaxed">{content.description}</p>
                </div>
              )}

              {content.genres.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Genres</h2>
                  <div className="flex flex-wrap gap-2">
                    {content.genres.map((cg, index) => (
                      <span
                        key={cg.genre.id}
                        className="bg-netflix-light-gray px-4 py-2 rounded hover:bg-netflix-red hover:scale-105 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {cg.genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {content.cast && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Cast</h2>
                  <p className="text-gray-300">{content.cast}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="bg-netflix-gray p-6 rounded-lg border border-gray-800 hover:border-netflix-red transition-all duration-300">
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-400 text-sm">Views</span>
                    <p className="text-2xl font-bold text-white">{content.viewCount.toLocaleString()}</p>
                  </div>
                  <div className="border-t border-gray-800 pt-4">
                    <span className="text-gray-400 text-sm">Added</span>
                    <p className="text-sm text-gray-300">{new Date(content.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Videos */}
          <div className="mt-12">
            <RelatedVideos 
              currentContentId={content.id} 
              genres={content.genres}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
