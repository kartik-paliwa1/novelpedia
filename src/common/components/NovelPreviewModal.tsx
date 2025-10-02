'use client';

import { X, Star, Eye, Heart, ThumbsUp, Bookmark } from 'lucide-react';
import { formatDate } from '@/utils/date-formatter';

interface NovelPreviewProps {
  novel: {
    title: string;
    starRating: number;
    status: string;
    genre: string;
    isOriginal?: boolean;
    synopsis: string;
    author: string;
    lastUpdated: string;
    tags?: string[];
    views: number;
    likes: number;
    rating: number;
  } | null;
  onClose: () => void;
}

export default function NovelPreviewModal({ novel, onClose }: NovelPreviewProps) {
  if (!novel) return null;

  const formatNumber = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className="absolute inset-0 bg-black/50 pointer-events-auto"
        onClick={onClose}
      ></div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="w-80 bg-[#483D8B] backdrop-blur-md rounded-lg shadow-2xl transition-all duration-300 animate-in zoom-in-95 overflow-hidden relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-6 h-6 bg-gray-800/50 hover:bg-gray-700/70 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3 text-gray-300" />
          </button>

\          <div className="p-4 pb-0">
            <h3 className="text-white font-bold text-xl mb-2 pr-6">{novel.title}</h3>

            <div className="flex items-center gap-2 mb-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white">{novel.starRating}</span>
              </div>
              <span className="text-gray-300">{novel.status}</span>
              <span className="bg-[#6A5ACD] text-white px-2 py-0.5 rounded-md text-xs">{novel.genre}</span>
              {novel.isOriginal && (
                <span className="bg-green-600 text-white px-2 py-0.5 rounded-md text-xs">Original</span>
              )}
            </div>

            <p className="text-gray-200 text-sm leading-relaxed mb-3 line-clamp-3">{novel.synopsis}</p>

            <div className="text-xs text-gray-300 mb-1">
              <span className="text-gray-400">Author:</span> {novel.author}
            </div>
            <div className="text-xs text-gray-300 mb-3">
              <span className="text-gray-400">Last Updated:</span> {formatDate(novel.lastUpdated)}
            </div>

            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-1.5">Tags:</div>
              <div className="flex flex-wrap gap-1.5">
                {novel.tags?.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-[#5D4EA8] text-white text-xs px-2 py-1 rounded-md hover:bg-[#6A5ACD] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-300 mb-4">
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{formatNumber(novel.views)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                <span>{formatNumber(novel.likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{novel.rating}%</span>
              </div>
            </div>
          </div>

          <div className="flex">
            <button className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-3 font-medium text-sm transition-colors">
              Read Now
            </button>
            <button className="w-12 h-12 bg-gray-800/50 hover:bg-gray-700/70 flex items-center justify-center transition-colors">
              <Bookmark className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
