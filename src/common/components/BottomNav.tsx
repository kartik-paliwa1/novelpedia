'use client';

import { useState } from 'react';
import { Home, Star, Book, MessageSquare, List } from 'lucide-react';

// Navigation items for the bottom navigation bar
const navItems = [
  { name: 'Home', label: 'Home', icon: Home },
  { name: 'Explore', label: 'Explore', icon: Star },
  { name: 'Forums', label: 'Forums', icon: MessageSquare, isCenter: true },
  { name: 'Feed', label: 'Feed', icon: List },
  { name: 'Library', label: 'Library', icon: Book },
];

export default function BottomNav() {
  // State to track the currently active navigation item
  const [activeNavItem, setActiveNavItem] = useState('Home');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 w-full max-w-screen-sm mx-auto pb-safe sm:pb-0">
      <div className="relative px-3 pb-1 pt-2">
        {/* BG panel */}
        <div className="absolute inset-0 bg-[#0D111C]/90 backdrop-blur-md border border-gray-700/30 rounded-t-3xl shadow-lg shadow-purple-900/20" />
        {/* Top glow */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        {/* Center cutout */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-transparent z-10" />
        <div className="relative z-20">
          <div className="flex items-center justify-between px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavItem === item.name;
              const isCenter = item.isCenter;

              if (isCenter) {
                // Render the center navigation item with a unique style
                return (
                  <div
                    key={item.name}
                    className="absolute left-1/2 transform -translate-x-1/2 -top-7"
                  >
                    <button
                      onClick={() => setActiveNavItem(item.name)}
                      className="relative group flex flex-col items-center"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-all duration-300 group-active:scale-95">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600/80 via-fuchsia-500/80 to-pink-500/80 blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                          <Icon
                            className="w-5 h-5 text-white relative z-10"
                            strokeWidth={2.5}
                          />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 blur-xl opacity-30 scale-110" />
                      </div>
                      <span className="mt-0.5 text-[10px] font-medium text-violet-400">
                        {item.label}
                      </span>
                    </button>
                  </div>
                );
              }

              // Render standard navigation items
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveNavItem(item.name)}
                  className={`flex flex-col items-center transition-all duration-300 py-1 px-1 rounded-xl w-1/5 ${
                    isActive
                      ? 'text-violet-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <div
                    className={`relative transition-all duration-300 ${
                      isActive ? 'scale-105' : 'group-hover:scale-100'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? 'text-violet-400' : ''}`}
                      strokeWidth={2}
                    />
                    {isActive && (
                      <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-violet-400 rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium mt-1 transition-colors duration-300 ${
                      isActive ? 'text-violet-400' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
