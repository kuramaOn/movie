import { Suspense } from 'react';
import Hero from '@/components/Hero';
import ContentRow from '@/components/ContentRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import prisma from '@/lib/db';
import { getAllWatchProgress } from '@/lib/utils';

async function getFeaturedContent() {
  const content = await prisma.content.findFirst({
    orderBy: [
      { rating: 'desc' },
      { viewCount: 'desc' },
    ],
  });
  return content;
}

async function getLatestContent() {
  const content = await prisma.content.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  return content;
}

async function getTrendingContent() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const content = await prisma.content.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    orderBy: { viewCount: 'desc' },
    take: 10,
  });
  return content;
}

async function getGenresWithContent() {
  const genres = await prisma.genre.findMany({
    include: {
      contents: {
        include: {
          content: true,
        },
        take: 10,
      },
    },
  });
  
  return genres.filter(genre => genre.contents.length > 0).map(genre => ({
    name: genre.name,
    contents: genre.contents.map(cg => cg.content),
  }));
}

async function getMovies() {
  const movies = await prisma.content.findMany({
    where: { type: 'movie' },
    orderBy: { rating: 'desc' },
    take: 10,
  });
  return movies;
}

async function getDocumentaries() {
  const docs = await prisma.content.findMany({
    where: { type: 'documentary' },
    orderBy: { rating: 'desc' },
    take: 10,
  });
  return docs;
}

export default async function HomePage() {
  const [
    featuredContent,
    latestContent,
    trendingContent,
    genresWithContent,
    movies,
    documentaries,
  ] = await Promise.all([
    getFeaturedContent(),
    getLatestContent(),
    getTrendingContent(),
    getGenresWithContent(),
    getMovies(),
    getDocumentaries(),
  ]);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      {featuredContent && <Hero content={featuredContent} />}

      {/* Empty state */}
      {!featuredContent && (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center space-y-4 animate-fade-in-up">
            <h1 className="text-4xl font-bold">Welcome to Network Chanel</h1>
            <p className="text-gray-400 text-lg">
              No content available yet. The admin can add content through the dashboard.
            </p>
          </div>
        </div>
      )}

      {/* Content Rows */}
      {featuredContent && (
        <div className="space-y-8 py-8">
          {latestContent.length > 0 && (
            <ContentRow title="Latest Uploads" contents={latestContent} />
          )}
          
          {trendingContent.length > 0 && (
            <ContentRow title="Trending Now" contents={trendingContent} />
          )}
          
          {movies.length > 0 && (
            <ContentRow title="Popular Movies" contents={movies} />
          )}
          
          {documentaries.length > 0 && (
            <ContentRow title="Top Documentaries" contents={documentaries} />
          )}
          
          {genresWithContent.map((genre) => (
            <ContentRow
              key={genre.name}
              title={genre.name}
              contents={genre.contents}
            />
          ))}
        </div>
      )}
    </div>
  );
}
