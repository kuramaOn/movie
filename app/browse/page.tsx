import { Suspense } from 'react';
import ContentCard from '@/components/ContentCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import prisma from '@/lib/db';

interface SearchParams {
  type?: string;
  genre?: string;
  search?: string;
}

async function getContent({ type, genre, search }: SearchParams) {
  const where: any = {};

  if (type && (type === 'movie' || type === 'documentary')) {
    where.type = type;
  }

  if (genre) {
    where.genres = {
      some: {
        genre: {
          slug: genre,
        },
      },
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const content = await prisma.content.findMany({
    where,
    orderBy: [
      { rating: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 50,
  });

  return content;
}

async function getGenres() {
  const genres = await prisma.genre.findMany({
    orderBy: { name: 'asc' },
  });
  return genres;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [content, genres] = await Promise.all([
    getContent(searchParams),
    getGenres(),
  ]);

  const activeType = searchParams.type || 'all';
  const activeGenre = searchParams.genre;
  const searchQuery = searchParams.search;

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      <div className="animate-fade-in-down">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Browse</h1>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {/* Type filter */}
        <div className="flex flex-wrap gap-2">
          <a
            href="/browse"
            className={`px-4 py-2 rounded transition ${
              activeType === 'all'
                ? 'bg-netflix-red text-white'
                : 'bg-netflix-light-gray text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </a>
          <a
            href="/browse?type=movie"
            className={`px-4 py-2 rounded transition ${
              activeType === 'movie'
                ? 'bg-netflix-red text-white'
                : 'bg-netflix-light-gray text-gray-300 hover:bg-gray-600'
            }`}
          >
            Movies
          </a>
          <a
            href="/browse?type=documentary"
            className={`px-4 py-2 rounded transition ${
              activeType === 'documentary'
                ? 'bg-netflix-red text-white'
                : 'bg-netflix-light-gray text-gray-300 hover:bg-gray-600'
            }`}
          >
            Documentaries
          </a>
        </div>

        {/* Genre filter */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-400 px-4 py-2">Genres:</span>
            {genres.map((genre) => (
              <a
                key={genre.id}
                href={`/browse?${activeType !== 'all' ? `type=${activeType}&` : ''}genre=${genre.slug}`}
                className={`px-4 py-2 rounded transition ${
                  activeGenre === genre.slug
                    ? 'bg-netflix-red text-white'
                    : 'bg-netflix-light-gray text-gray-300 hover:bg-gray-600'
                }`}
              >
                {genre.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Search results info */}
      {searchQuery && (
        <div className="mb-4 text-gray-400">
          Search results for: <span className="text-white font-semibold">{searchQuery}</span>
        </div>
      )}

      {/* Content grid */}
      {content.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {content.map((item, index) => (
            <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
            <ContentCard
              id={item.id}
              title={item.title}
              thumbnailUrl={item.thumbnailUrl || '/placeholder-thumbnail.jpg'}
              type={item.type}
              duration={item.duration || undefined}
              rating={item.rating ? Number(item.rating) : undefined}
              year={item.year || undefined}
            />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400">No content found</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
