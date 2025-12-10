import { notFound } from 'next/navigation';
import CinematicHero from '@/components/CinematicHero';
import CinematicDetailsSection from '@/components/CinematicDetailsSection';
import RelatedVideos from '@/components/RelatedVideos';
import LayoutSwitcher from '@/components/LayoutSwitcher';
import prisma from '@/lib/db';

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
    take: 12,
  });

  return suggestions;
}

export default async function CinematicWatchPage({ params }: { params: { id: string } }) {
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
    <div className="min-h-screen bg-netflix-black">
      {/* Layout Switcher */}
      <LayoutSwitcher contentId={content.id} />
      
      {/* Cinematic Hero Section */}
      <CinematicHero content={content} />

      {/* Details Section */}
      <CinematicDetailsSection content={content} />

      {/* Related Videos */}
      <div className="px-6 md:px-12 lg:px-16 pb-16">
        <RelatedVideos 
          currentContentId={content.id} 
          genres={content.genres}
        />
      </div>
    </div>
  );
}
