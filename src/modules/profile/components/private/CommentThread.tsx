// /components/profile/private/CommentThread.tsx
import { FC } from "react";
import { ThumbsUp, Reply, MoreHorizontal } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { Comment } from '@/modules/profile/components/private/MyActivity'; // reuse the shared type

interface CommentThreadProps {
  avatar: string;
  displayName: string;
  comment: Comment;
}

// Displays a single comment thread with optional replies
const CommentThread: FC<CommentThreadProps> = ({ avatar, displayName, comment }) => {
  return (
    <div className="space-y-4">
      {/* Main comment card */}
      <div className="bg-gray-800/50 rounded-2xl p-4 sm:p-5 border border-gray-700/20">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 rounded-full p-0.5 flex-shrink-0">
            <div
              className="w-full h-full bg-cover bg-center rounded-full"
              style={{ backgroundImage: `url(${avatar})` }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-medium">{displayName}</span>
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-400 text-sm">{comment.timeAgo}</span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-gray-400 text-sm">💬</span>
              <span className="text-gray-400 text-sm">Commented</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Comment body */}
        <p className="text-white text-sm leading-relaxed mb-4">{comment.commentText}</p>

        {/* Chapter context */}
        <div className="bg-gray-700/30 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-16 bg-gray-800/50 rounded-lg overflow-hidden flex-shrink-0">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${comment.novelCover})` }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs mb-1">{comment.chapterTitle}</p>
              <h4 className="text-white font-medium text-sm truncate">{comment.novelTitle}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-400 text-xs">{comment.genre}</span>
                <span className="text-gray-500 text-xs">•</span>
                <span className="text-gray-400 text-xs">{comment.author}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comment actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">{comment.likes}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors">
              <Reply className="w-4 h-4" />
              <span className="text-sm">{comment.replies.length}</span>
            </button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-xs"
          >
            View in Context
          </Button>
        </div>
      </div>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="ml-8 space-y-3">
          {comment.replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-gray-800/30 rounded-xl p-4 border-l-2 border-violet-500/30"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${reply.avatar})` }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">{reply.username}</span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className="text-gray-400 text-xs">{reply.timeAgo}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-2">{reply.text}</p>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                      <ThumbsUp className="w-3 h-3" />
                      <span className="text-xs">{reply.likes}</span>
                    </button>
                    <button className="text-gray-400 hover:text-blue-400 text-xs transition-colors">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
