import { Target } from "lucide-react";
import ReadingGoalsProgress from '@/modules/profile/components/private/ReadingGoalsProgress';
import MyStatsPanel from '@/modules/profile/components/private/MyStatsPanel';

interface OverviewTabProps {
  readingGoals: {
    daily: { current: number; target: number; type: string };
    weekly: { current: number; target: number; type: string };
    monthly: { current: number; target: number; type: string };
  };
  stats: {
    seriesPublished: number;
    totalWordsWritten: number;
    totalPageviews: number;
    reviewsReceived: number;
    readersReached: number;
    followers: number;
  };
}

export default function OverviewTab({ readingGoals, stats }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Reading Goals */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/20">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-violet-400" />
          Reading Goals & Progress
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <ReadingGoalsProgress
            label="Daily Goal"
            current={readingGoals.daily.current}
            target={readingGoals.daily.target}
            unit="Pages today"
            gradient="from-violet-500 to-fuchsia-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReadingGoalsProgress
              label="Weekly Goal"
              current={readingGoals.weekly.current}
              target={readingGoals.weekly.target}
              unit="Hours this week"
              gradient="from-emerald-500 to-cyan-500"
            />
            <ReadingGoalsProgress
              label="Monthly Goal"
              current={readingGoals.monthly.current}
              target={readingGoals.monthly.target}
              unit="Books this month"
              gradient="from-orange-500 to-red-500"
            />
          </div>
        </div>
      </div>

      {/* Author Stats */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/20">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">📈 My Stats</h3>
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-gray-300 font-medium">Last Active</div>
            <div className="text-green-400">5 mins ago</div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-gray-300 font-medium">Member Since</div>
            <div className="text-white">March 2022</div>
          </div>
        </div>
        <MyStatsPanel stats={stats} />
      </div>
    </div>
  );
}
