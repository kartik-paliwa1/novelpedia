'use client';
import { BookOpen, ThumbsUp, ArrowRight } from 'lucide-react';
import { Book } from '@/modules/landing/components/section4/genre_landingpage/genreData';

type Props = {
  book: Book;
  gradient: string;
};

export default function FeaturedTopBook({ book, gradient }: Props) {
  return (
    <div className={`relative p-4 bg-gradient-to-b ${gradient} bg-opacity-50 flex items-center gap-4`}>
      <div className="w-20 h-28 bg-gray-800/30 rounded-lg overflow-hidden shadow-lg">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${book.image || `https://placehold.co/150x200/6b7280/ffffff?text=${encodeURIComponent(book.title || 'Book')}`})` }}
        />
      </div>
      <div className="flex-1">
        <h4 className="text-white font-bold text-lg mb-1">{book.title}</h4>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4 text-white" />
            <span className="text-white">{book.rating}%</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-white/80" />
            <span className="text-white/80">{Number(book.chapters ?? 0).toLocaleString()} chapters</span>
          </div>
        </div>
        <button className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors">
          <span>Read Now</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
