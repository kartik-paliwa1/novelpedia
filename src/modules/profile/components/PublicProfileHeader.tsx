'use client';

import { Calendar, MapPin, Share2, MoreHorizontal, UserPlus, UserCheck } from 'lucide-react';
import { Button } from '@/common/components/ui/button';

interface PublicProfileHeaderProps {
  profile: {
    avatar: string;
    displayName: string;
    username: string;
    bio: string;
    joinDate: string;
    location: string;
    isVerified?: boolean;
    isAuthor?: boolean;
  };
  isFollowing: boolean;
  onFollowToggle: () => void;
}

export default function PublicProfileHeader({
  profile,
  isFollowing,
  onFollowToggle,
}: PublicProfileHeaderProps) {
  return (
    <section className="px-4 py-6 sm:py-8 relative z-10">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700/20 overflow-hidden">
        {/* Cover */}
        <div className="h-28 sm:h-32 bg-gradient-to-r from-violet-600/20 via-fuchsia-500/20 to-pink-500/20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
        </div>

        <div className="px-4 sm:px-6 pb-6 -mt-12 sm:-mt-16 relative">
          <div className="flex flex-col items-center sm:flex-row sm:items-end gap-4 mb-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-30 h-30 sm:w-34 sm:h-34 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 rounded-2xl p-1 shadow-xl">
                <div
                  className="w-full h-full bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: `url(${profile.avatar})` }}
                />
              </div>

              {profile.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex-1 flex flex-row sm:justify-end gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-xl text-sm"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-xl"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>

              {profile.isAuthor && (
                <Button
                  size="sm"
                  onClick={onFollowToggle}
                  className={`flex-1 sm:flex-none rounded-xl transition-all duration-300 text-sm ${
                    isFollowing
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow Author
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="mb-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {profile.displayName}
              </h1>
              {/* Verification badge for trusted/official accounts */}
              {profile.isVerified && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <p className="text-violet-400 text-lg sm:text-xl mb-3">
              @{profile.username}
            </p>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 max-w-2xl">
              {profile.bio}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {profile.joinDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
