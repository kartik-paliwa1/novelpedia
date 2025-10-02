// Props for the user's profile header information
import { Calendar, MapPin } from 'lucide-react';

interface ProfileInfoBlockProps {
  displayName: string;
  username: string;
  bio: string;
  joinDate: string;
  location: string;
  isVerified: boolean;
}

export default function ProfileInfoBlock({
  displayName,
  username,
  bio,
  joinDate,
  location,
  isVerified,
}: ProfileInfoBlockProps) {
  return (
    <div className="mb-6 text-center sm:text-left">
      <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{displayName}</h1>
        {/* Verification badge for trusted/official accounts */}
        {isVerified && (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>
      <p className="text-violet-400 text-lg sm:text-xl mb-3">@{username}</p>
      <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 max-w-2xl">
        {bio}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>Joined {joinDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}
