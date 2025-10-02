// components/profile/ProfileTabs.tsx

interface ProfileTabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProfileTabs({ tabs, activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <div className="mb-6">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/30 overflow-x-auto">
        {/* Tab bar is scrollable on small screens */}
        <div role="tablist" className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 sm:px-6 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
