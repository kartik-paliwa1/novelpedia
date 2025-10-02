import { BookOpen, Eye, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { formatDate } from '@/utils/date-formatter';

// Work item structure for user's published content
interface Work {
  id: number;
  title: string;
  description: string;
  cover: string;
  status: string; // e.g., "Ongoing", "Completed", "Hiatus"
  chapters: number;
  reads: number;
  rating: number;
  lastUpdated: string;
  genre: string;
}

interface PublishedWorksProps {
  works: Work[];
  formatNumber: (num: number) => string;
}

export default function PublishedWorks({ works, formatNumber }: PublishedWorksProps) {
  return (
    <div className="space-y-4">
      {works.map((work) => (
        <div
          key={work.id}
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-700/20 hover:border-violet-500/30 transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Book cover thumbnail */}
            <div className="w-20 h-28 bg-gray-800/50 rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${work.cover || `https://placehold.co/150x200/6b7280/ffffff?text=${encodeURIComponent(work.title || 'Work')}`})` }}
              ></div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-3">
                <div className="mb-2 sm:mb-0">
                  <h3 className="text-white font-semibold text-lg mb-2">{work.title}</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        work.status === 'Ongoing'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {work.status}
                    </span>
                    <span className="text-gray-400 text-sm">{work.genre}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-sm font-medium">{work.rating}</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">{work.description}</p>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{work.chapters} chapters</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(work.reads)}</span>
                  </div>
                  <span>Updated {formatDate(work.lastUpdated)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-sm"
                >
                  Read Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
