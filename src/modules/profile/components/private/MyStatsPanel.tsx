import React from "react";

interface MyStatsPanelProps {
  stats: {
    seriesPublished: number;
    totalWordsWritten: number;
    totalPageviews: number;
    reviewsReceived: number;
    readersReached: number;
    followers: number;
  };
}

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

export default function MyStatsPanel({ stats }: MyStatsPanelProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-gray-800/50 rounded-xl p-4 text-center relative">
        <div className="text-2xl font-bold text-white mb-1">{stats.seriesPublished}</div>
        <div className="text-sm text-gray-400">Series Written</div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"></div>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-4 text-center relative">
        <div className="text-2xl font-bold text-white mb-1">{formatNumber(stats.totalWordsWritten)}</div>
        <div className="text-sm text-gray-400">Total Words</div>
        <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
          <div
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1 rounded-full"
            style={{ width: "75%" }}
          />
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-white mb-1">{formatNumber(stats.totalPageviews)}</div>
        <div className="text-sm text-gray-400">Total Pageviews</div>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-white mb-1">{stats.reviewsReceived}</div>
        <div className="text-sm text-gray-400">Reviews Received</div>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-white mb-1">{formatNumber(stats.readersReached)}</div>
        <div className="text-sm text-gray-400">Readers</div>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-white mb-1">{stats.followers}</div>
        <div className="text-sm text-gray-400">Followers</div>
      </div>
    </div>
  );
}
