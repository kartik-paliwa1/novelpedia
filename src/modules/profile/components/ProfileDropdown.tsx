'use client';

import {
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  User,
  Clock,
  Star,
  PenTool,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type MenuItem = {
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  count?: number;
};

type ProfileDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProfileDropdown({
  isOpen,
  onClose,
}: ProfileDropdownProps) {
  const [unreadMessages] = useState(3);
  const [unreadNotifications] = useState(7);
  const router = useRouter();

  const userInfo = {
    avatar: '/placeholder.svg?height=48&width=48',
    displayName: 'Utkarsh',
    username: 'Broly Sensei',
    isAuthor: true,
    currentBadge: {
      name: 'Review Master',
      icon: Star,
      rarity: 'rare',
      color: 'from-blue-500 to-cyan-500',
    },
  };

  if (!isOpen) return null;

  const menuItems: MenuItem[] = [
    {
      label: 'Inbox',
      desc: 'Your messages and notifications',
      icon: MessageSquare,
      color: 'blue',
      count: unreadMessages + unreadNotifications,
    },
    {
      label: 'My Activity',
      desc: 'Takes you to the activity tab under profile',
      icon: Clock,
      color: 'purple',
    },
    {
      label: 'Profile',
      desc: `View your Profile /u/${userInfo.username}`,
      icon: User,
      color: 'violet',
    },
    ...(userInfo.isAuthor
      ? [
          {
            label: 'Your Author Dashboard',
            desc: 'Manage your published works',
            icon: PenTool,
            color: 'emerald',
          },
        ]
      : []),
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute top-full right-0 mt-3 w-full max-w-sm z-50 px-4 sm:px-0">
        <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/40 rounded-2xl shadow-xl overflow-hidden max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="p-4 bg-gradient-to-br from-violet-600/15 via-fuchsia-500/10 to-pink-500/15 border-b border-gray-700/30">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 rounded-xl p-0.5 shadow">
                  <div
                    className="w-full h-full bg-cover bg-center rounded-xl"
                    style={{ backgroundImage: `url(${userInfo.avatar})` }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base truncate">
                  {userInfo.displayName}
                </h3>
                <p className="text-violet-400 text-xs truncate">
                  @{userInfo.username}
                </p>
              </div>

              <div className="flex-shrink-0">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${userInfo.currentBadge.color} rounded-xl flex items-center justify-center border border-white/10`}
                  title={`${userInfo.currentBadge.name} (${userInfo.currentBadge.rarity})`}
                >
                  <userInfo.currentBadge.icon
                    className="w-5 h-5 text-white"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-3 space-y-2">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-800/50 rounded-xl transition-all group"
                >
                  <div
                    className={`w-10 h-10 bg-${item.color}-500/20 rounded-xl flex items-center justify-center group-hover:bg-${item.color}-500/30 transition-colors border border-${item.color}-500/20`}
                  >
                    <Icon className={`w-5 h-5 text-${item.color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm">
                      {item.label}
                    </div>
                    <div className="text-gray-400 text-xs">{item.desc}</div>
                  </div>
                  {item.count && (
                    <div className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                      {item.count}
                    </div>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                </button>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-gray-700/30 space-y-2">
            <button
              onClick={() => {
                onClose(); // close dropdown
                router.push('/account/settings');
              }}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-800/50 rounded-xl transition-all group"
            >
              <div className="w-9 h-9 bg-gray-700/50 rounded-xl flex items-center justify-center group-hover:bg-gray-700">
                <Settings className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors text-sm font-medium">
                Settings
              </span>
            </button>

            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-500/10 rounded-xl transition-all group">
              <div className="w-9 h-9 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30">
                <LogOut className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-red-400 group-hover:text-red-300 transition-colors text-sm font-medium">
                Log Out
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
