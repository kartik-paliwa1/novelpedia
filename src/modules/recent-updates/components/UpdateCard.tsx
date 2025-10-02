import { UpdateItem } from '@/modules/recent-updates/components/updateTypes';

type Props = { novel: UpdateItem };

export default function UpdateCard({ novel }: Props) {
  const UpdateMeta = ({ timeAgo, genre }: { timeAgo: string; genre: string }) => (
    <div className="flex items-center gap-3 text-xs text-gray-400">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <span>{timeAgo}</span>
      </div>
      <span>•</span>
      <span className="bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded-md">{genre}</span>
    </div>
  );

  return (
    <div className="p-4 hover:bg-gray-700/20 transition-all duration-300 cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-16 bg-gray-800/50 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${novel.image || `https://placehold.co/80x120/6b7280/ffffff?text=${encodeURIComponent(novel.title || 'Novel')}`})` }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-medium text-base leading-tight line-clamp-1 group-hover:text-violet-300 transition-colors">
              {novel.title}
            </h3>
            {novel.isNew && (
              <span className="ml-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                NEW
              </span>
            )}
          </div>
          <div className="mb-2 text-violet-400 font-medium text-sm">
            {novel.chapter}
            {novel.chapterTitle && (
              <span className="text-gray-300 font-normal">: {novel.chapterTitle}</span>
            )}
          </div>
          <UpdateMeta timeAgo={novel.timeAgo} genre={novel.genre} />
        </div>
        <div className="w-8 h-11 bg-gray-800/50 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${novel.image || `https://placehold.co/60x80/6b7280/ffffff?text=${encodeURIComponent(novel.title || 'Novel')}`})` }}
          />
        </div>
      </div>
    </div>
  );
}
