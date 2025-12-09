'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlayIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

interface Content {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  year: number;
  duration: number;
  rating: number;
  genres: Array<{
    genre: {
      id: number;
      name: string;
    };
  }>;
}

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: Content | null;
}

export default function QuickViewModal({ isOpen, onClose, content }: QuickViewModalProps) {
  if (!content) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-gray-900 shadow-xl transition-all">
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>

                  {/* Thumbnail */}
                  <div className="relative h-96">
                    <Image
                      src={content.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                      alt={content.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                    
                    {/* Play Button Overlay */}
                    <Link
                      href={`/watch/${content.id}`}
                      className="absolute inset-0 flex items-center justify-center group"
                    >
                      <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/50 transition-all group-hover:scale-110">
                        <PlayIcon className="w-12 h-12 text-white ml-1" />
                      </div>
                    </Link>
                  </div>

                  {/* Content Info */}
                  <div className="p-8">
                    <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
                    
                    {/* Metadata */}
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-300">
                      {content.year && <span>{content.year}</span>}
                      {content.duration && <span>{content.duration} min</span>}
                      {content.rating && (
                        <span className="flex items-center">
                          ⭐ {content.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Genres */}
                    {content.genres && content.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {content.genres.map((g) => (
                          <span
                            key={g.genre.id}
                            className="px-3 py-1 bg-gray-700 rounded-full text-xs"
                          >
                            {g.genre.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    {content.description && (
                      <p className="text-gray-300 mb-6 line-clamp-3">
                        {content.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <Link
                        href={`/watch/${content.id}`}
                        className="flex-1 bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition text-center flex items-center justify-center space-x-2"
                      >
                        <PlayIcon className="w-5 h-5" />
                        <span>Play Now</span>
                      </Link>
                      <Link
                        href={`/watch/${content.id}`}
                        className="px-6 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition"
                      >
                        More Info
                      </Link>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
