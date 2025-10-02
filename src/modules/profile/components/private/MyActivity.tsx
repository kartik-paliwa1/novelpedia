// /components/profile/private/MyActivityTab.tsx
import { FC } from "react";
import { MessageCircle } from "lucide-react";
import CommentThread from '@/modules/profile/components/private/CommentThread';

// Reusable types
export interface Reply {
  id: number;
  username: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
}

export interface Comment {
  id: number;
  commentText: string;
  chapterTitle: string;
  novelTitle: string;
  novelCover: string;
  genre: string;
  author: string;
  timeAgo: string;
  likes: number;
  replies: Reply[];
}

// Props for the activity tab
interface MyActivityTabProps {
  avatar: string;
  displayName: string;
  comments: Comment[];
}

// Renders the "My Comments" section in private profile
const MyActivityTab: FC<MyActivityTabProps> = ({ avatar, displayName, comments }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/20">
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-violet-400" />
          My Comments
        </h3>

        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              avatar={avatar}
              displayName={displayName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyActivityTab;
