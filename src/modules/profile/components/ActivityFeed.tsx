import { Star, Clock, BookMarked, BookOpen } from 'lucide-react';

// Activity item structure for user activity feed
interface Activity {
  id: number;
  type: string;
  action: string;
  target: string;
  rating?: number;
  timeAgo: string;
}

interface ActivityFeedProps {
  recentActivity: Activity[];
}

// Maps activity types to their respective icons with styling
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'published':
      return <BookMarked className="w-4 h-4 text-green-400" />;
    case 'review':
      return <Star className="w-4 h-4 text-yellow-400" />;
    case 'collection':
      return <BookOpen className="w-4 h-4 text-blue-400" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

export default function ActivityFeed({ recentActivity }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-white font-semibold text-lg mb-2">Recent Reviews</h3>
        <p className="text-gray-400 text-sm">Public activity showing recent reviews posted</p>
      </div>
      {recentActivity.map((activity) => (
        <div
          key={activity.id}
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-700/20 hover:border-violet-500/30 transition-all duration-300"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm leading-relaxed">
                <span className="text-gray-400">{activity.action}</span>{' '}
                <span className="text-violet-400 font-medium">{activity.target}</span>
                {activity.rating && (
                  <span className="text-yellow-400 ml-2 flex items-center gap-1 inline-flex">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    {activity.rating}
                  </span>
                )}
              </p>
              <p className="text-gray-400 text-xs mt-1">{activity.timeAgo}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
