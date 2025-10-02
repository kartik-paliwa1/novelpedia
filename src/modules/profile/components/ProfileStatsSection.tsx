import StatCard from '@/modules/profile/components/StatCard';
import { Star, BookOpen, PenTool, Award } from 'lucide-react';

interface ReadingStats {
  chaptersRead: number;
  timeSpentReading: string | number;
  readingStreak: number;
  booksRead: number;
  averageRatingGiven: number;
}

interface AuthorStats {
  seriesPublished: number;
  totalWordsWritten: number;
  totalPageviews: number;
  reviewsReceived: number;
  readersReached: number;
  followers: number;
}

interface EngagementStats {
  commentsMade: number;
  forumPosts: number;
  reviewsWritten: number;
  bookmarksCreated: number;
  subscriptions: number;
}

interface ProfileStatsSectionProps {
  readingStats: ReadingStats;
  authorStats?: AuthorStats;
  engagementStats: EngagementStats;
  isAuthor: boolean;
  formatNumber: (num: number) => string;
}

export default function ProfileStatsSection({
  readingStats,
  authorStats,
  engagementStats,
  isAuthor,
  formatNumber,
}: ProfileStatsSectionProps) {
  return (
    <div className="space-y-4">
      {/* Reading Stats */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-700/20">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> Reading Stats
        </h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <StatCard label="Chapters Read" value={formatNumber(readingStats.chaptersRead)} />
            <StatCard label="Time Reading" value={readingStats.timeSpentReading} />
            <StatCard label="Day Streak" value={readingStats.readingStreak} icon={<span>🔥</span>} />
          </div>
          <div className="flex gap-3">
            <StatCard label="Books Read" value={readingStats.booksRead} />
            <StatCard
              label="Avg Rating Given"
              value={readingStats.averageRatingGiven}
              icon={<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
            />
            <StatCard label="-" value="-" />
          </div>
        </div>
      </div>

      {/* Author Stats */}
      {isAuthor && authorStats && (
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-700/20">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <PenTool className="w-5 h-5" /> Author Stats
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <StatCard label="Series Published" value={authorStats.seriesPublished} />
              <StatCard label="Words Written" value={formatNumber(authorStats.totalWordsWritten)} />
              <StatCard label="Total Pageviews" value={formatNumber(authorStats.totalPageviews)} />
            </div>
            <div className="flex gap-3">
              <StatCard label="Reviews Received" value={authorStats.reviewsReceived} />
              <StatCard label="Readers Reached" value={formatNumber(authorStats.readersReached)} />
              <StatCard label="Followers" value={formatNumber(authorStats.followers)} />
            </div>
          </div>
        </div>
      )}

      {/* Engagement Stats */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-700/20">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" /> Engagement Stats
        </h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <StatCard label="Comments Made" value={formatNumber(engagementStats.commentsMade)} />
            <StatCard label="Forum Posts" value={engagementStats.forumPosts} />
            <StatCard label="Reviews Written" value={engagementStats.reviewsWritten} />
          </div>
          <div className="flex gap-3">
            <StatCard label="Bookmarks" value={engagementStats.bookmarksCreated} />
            <StatCard label="Subscriptions" value={engagementStats.subscriptions} />
            <StatCard label="-" value="-" />
          </div>
        </div>
      </div>
    </div>
  );
}
