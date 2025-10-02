import { Star } from 'lucide-react';

// Props for displaying key user metrics in a responsive grid layout
interface VanityStatsRowProps {
  followers: number;
  following: number;
  publishedWorks: number;
  totalReads: number;
  averageRating: number;
  formatNumber: (num: number) => string;
}

export default function VanityStatsRow({
  followers,
  following,
  publishedWorks,
  totalReads,
  averageRating,
  formatNumber,
}: VanityStatsRowProps) {
  return (
    // Responsive grid - 2 columns on mobile, 5 columns on larger screens
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
      <div className="text-center">
        <div className="text-xl sm:text-2xl font-bold text-white">
          {formatNumber(followers)}
        </div>
        <div className="text-xs sm:text-sm text-gray-400">Followers</div>
      </div>
      <div className="text-center">
        <div className="text-xl sm:text-2xl font-bold text-white">{following}</div>
        <div className="text-xs sm:text-sm text-gray-400">Following</div>
      </div>
      <div className="text-center">
        <div className="text-xl sm:text-2xl font-bold text-white">{publishedWorks}</div>
        <div className="text-xs sm:text-sm text-gray-400">Works</div>
      </div>
      <div className="text-center">
        <div className="text-xl sm:text-2xl font-bold text-white">
          {formatNumber(totalReads)}
        </div>
        <div className="text-xs sm:text-sm text-gray-400">Total Reads</div>
      </div>
      <div className="text-center col-span-2 sm:col-span-1">
        <div className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-1">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          {averageRating}
        </div>
        <div className="text-xs sm:text-sm text-gray-400">Avg Rating</div>
      </div>
    </div>
  );
}
