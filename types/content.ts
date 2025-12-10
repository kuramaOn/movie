// Shared Content type definition to prevent type mismatches across components

export interface Content {
  id: number;
  title: string;
  description: string;
  type: string;
  videoUrl: string;
  thumbnailUrl: string;
  year: number;
  duration: number;
  rating: number;
  viewCount?: number; // Optional since not all queries include this
  createdAt?: Date;
  updatedAt?: Date;
  genres: Array<{
    genre: {
      id: number;
      name: string;
    };
  }>;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}
