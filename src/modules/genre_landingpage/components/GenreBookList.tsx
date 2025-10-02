'use client';
import { ChevronRight, BookOpen, ThumbsUp } from 'lucide-react';
import { Book } from '@/modules/genre_landingpage/components/genreData';

type Props = {
  genre: string;
  books: Book[];
  bgColor: string;
  textColor: string;
  color: string;
};

export default function GenreBookList({ genre, books, bgColor, textColor, color }: Props) {
  const formatNumber = (num: number | undefined) => Number(num ?? 0).toLocaleString();

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-b-xl p-4 border border-gray-700/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium">More in {genre}</h4>
        <button className={`text-xs ${textColor}`}>View All</button>
      </div>
      <div className="space-y-3">
        {books.map((book, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-12 h-16 bg-gray-800/50 rounded-md overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${book.image || `https://placehold.co/80x120/6b7280/ffffff?text=${encodeURIComponent(book.title || 'Book')}`})` }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-white text-sm font-medium mb-1 truncate">{book.title}</h5>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{book.rating}%</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{formatNumber(book.chapters)}</span>
                </div>
              </div>
            </div>
            <button className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
              <ChevronRight className={`w-4 h-4 ${textColor}`} />
            </button>
          </div>
        ))}
      </div>
      <button className={`w-full mt-4 bg-gradient-to-r ${color} text-white py-3 rounded-xl font-medium text-sm`}>
        Explore All {genre} Novels
      </button>
    </div>
  );
}
