// Props for user metadata to display in the snapshot section
interface UserSnapshotProps {
  lastActive: string;
  memberSince: string;
  location?: string;
  favoriteNovel?: string;
  bio?: string;
}

export default function UserSnapshot({
  lastActive,
  memberSince,
  location,
  favoriteNovel,
  bio,
}: UserSnapshotProps) {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-700/20">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">\ud83d\udd0d User Snapshot</h3>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-gray-300 font-medium">Last Active</div>
          <div className="text-white">{lastActive}</div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-gray-300 font-medium">Member Since</div>
          <div className="text-white">{memberSince}</div>
        </div>
        {location && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-gray-300 font-medium">Location</div>
            <div className="text-white">{location}</div>
          </div>
        )}
        {favoriteNovel && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-gray-300 font-medium">Favourite Novel:</div>
            <div className="text-violet-400 hover:text-violet-300 cursor-pointer">
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                {favoriteNovel}
              </a>
            </div>
          </div>
        )}
        {bio && (
          <div className="space-y-2">
            <div className="text-gray-300 font-medium">About</div>
            <div className="text-white text-sm leading-relaxed">{bio}</div>
          </div>
        )}
      </div>
    </div>
  );
}
