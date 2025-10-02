'use client';

import { Calendar, Camera, Globe, Lock, Edit3 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';

interface PrivateProfileHeaderProps {
  profile: {
    avatar: string;
    displayName: string;
    username: string;
    bio: string;
    joinDate: string;
    location: string;
  };
  isEditing: boolean;
  isPrivate: boolean;
  setIsEditing: (v: boolean) => void;
}

export default function PrivateProfileHeader({
  profile,
  isEditing,
  isPrivate,
  setIsEditing,
}: PrivateProfileHeaderProps) {
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
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-violet-600 hover:bg-violet-500 rounded-full border-2 border-gray-800 flex items-center justify-center transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Edit Button */}
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-xl text-sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? 'Save' : 'Edit Profile'}
            </Button>
          </div>

          {/* Profile Info */}
          <div className="mb-6 text-center sm:text-left">
            {isEditing ? (
              <div className="space-y-3">
                <Input defaultValue={profile.displayName} placeholder="Display Name" />
                <Input defaultValue={profile.username} placeholder="Username" />
                <textarea
                  defaultValue={profile.bio}
                  className="w-full p-3 rounded-xl resize-none text-sm bg-gray-800/50 border border-gray-700/50 text-white"
                  rows={3}
                  placeholder="Bio"
                />
              </div>
            ) : (
              <>
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">{profile.displayName}</h1>
                <p className="text-violet-400 text-base sm:text-lg mb-2">@{profile.username}</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-3 max-w-2xl">{profile.bio}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {profile.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📍</span>
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isPrivate ? <Lock className="w-4 h-4 text-orange-400" /> : <Globe className="w-4 h-4 text-green-400" />}
                    <span>{isPrivate ? 'Private' : 'Public'}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
