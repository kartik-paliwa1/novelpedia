'use client';

import { useState } from 'react';
import { Star, Eye, ChevronRight } from 'lucide-react';
import NovelPreviewModal from '@/common/components/NovelPreviewModal'; // Adjust path if needed

export interface Book {
  id: number;
  title: string;
  rating: number;
  views: number;
  rank: number;
  cover: string;
  synopsis?: string;
  author?: string;
  lastUpdated?: string;
  status?: string;
  genre?: string;
  isOriginal?: boolean;
  tags?: string[];
  likes?: number;
}

// Props for the SectionCarousel component
interface SectionCarouselProps {
  title: string; // Title of the section
  books: Book[]; // List of books to display in the carousel
}

export default function SectionCarousel({
  title,
  books,
}: SectionCarouselProps) {
  // State to track the currently selected novel for the modal
  const [selectedNovel, setSelectedNovel] = useState<Book | null>(null);

  return (
    <section className="px-4 mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-[#c553eb] rounded-full" />
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <button className="flex items-center space-x-1 text-purple-400 text-sm">
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Book Cards */}
      <div className="grid grid-cols-3 gap-3">
        {Array.isArray(books) ? books.map((book) => (
          <div
            key={book.id}
            className="relative cursor-pointer"
            onClick={() => setSelectedNovel(book)}
          >
            {/* Cover with rank badge */}
            <div className="aspect-[2/3] bg-slate-800 rounded-lg overflow-hidden mb-2 relative">
              <div className="absolute top-2 left-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {book.rank}
                </span>
              </div>
              {/* Placeholder cover */}
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800" />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-yellow-400 text-xs font-medium">
                  {book.rating}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3 text-blue-400" />
                <span className="text-blue-400 text-xs font-medium">
                  {book.views}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-white text-xs font-medium leading-tight line-clamp-2">
              {book.title}
            </h3>
          </div>
        )) : (
          <div className="col-span-3 text-center text-gray-400 py-8">
            No books available
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedNovel && (
        <NovelPreviewModal
          novel={{
            ...selectedNovel,
            starRating: selectedNovel.rating,
            synopsis: selectedNovel.synopsis || 'No synopsis available.',
            author: selectedNovel.author || 'Unknown Author',
            lastUpdated: selectedNovel.lastUpdated || 'Unknown',
            status: selectedNovel.status || 'Ongoing',
            genre: selectedNovel.genre || 'Fantasy',
            likes: selectedNovel.likes || 0,
          }}
          onClose={() => setSelectedNovel(null)}
        />
      )}
    </section>
  );
}
