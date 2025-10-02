'use client';

import { ChevronRight } from 'lucide-react';
import UpdateList from '@/modules/recent-updates/components/UpdateList';

// Top-level section: wraps the full "Recently Updated" UI block
export default function Recently_Updated() {
  return (
    <section className="px-4 pb-8 relative z-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Recently Updated</h3>
        <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium flex items-center gap-1">
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/20 overflow-hidden">
        <UpdateList />

        <div className="p-4 border-t border-gray-700/30">
          <button className="w-full bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 hover:from-violet-600/30 hover:to-fuchsia-600/30 border border-violet-500/30 text-violet-300 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 group">
            <span>Load More Updates</span>
            <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-800/40 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/30">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-gray-400 text-xs">Updates every few minutes</span>
        </div>
      </div>
    </section>
  );
}
