/**
 * Mock Comment Thread Data
 * 
 * Sample comment threads for paragraph comments with realistic
 * conversations, author interactions, and context.
 */

export const mockCommentThreads = {
  "thread-1": {
    id: "thread-1",
    originalComment: {
      id: "comment-1",
      user: "You",
      content: "This chapter was absolutely incredible! The way you described the battle scene gave me chills. I can't wait to see what happens next...",
      timestamp: "2024-08-11T10:00:00Z",
      likes: 12,
      isLiked: false
    },
    replies: [
      {
        id: "reply-1",
        user: "Elena Martinez",
        content: "Thank you so much! I'm thrilled you enjoyed the battle scene. I spent weeks perfecting those descriptions.",
        timestamp: "2024-08-11T11:00:00Z",
        likes: 5,
        isLiked: true,
        isAuthor: true
      },
      {
        id: "reply-2",
        user: "BookLover23",
        content: "I agree! This is definitely one of the best chapters so far.",
        timestamp: "2024-08-11T11:30:00Z",
        likes: 3,
        isLiked: false,
        isAuthor: false
      }
    ],
    context: {
      novelTitle: "The Crystal Chronicles",
      chapterTitle: "Chapter 15: The Final Battle",
      chapterNumber: 15,
      paragraphSnippet: "The crystal sword gleamed in the moonlight as Lyra raised it against the shadow beast, its ethereal glow cutting through the darkness like a beacon of hope",
      author: "Elena Martinez"
    }
  },
  "thread-2": {
    id: "thread-2",
    originalComment: {
      id: "comment-2",
      user: "FantasyFan",
      content: "The magic system in this world is so well thought out. Every spell feels meaningful and has consequences.",
      timestamp: "2024-08-11T07:00:00Z",
      likes: 8,
      isLiked: true
    },
    replies: [
      {
        id: "reply-3",
        user: "Elena Martinez",
        content: "That means so much to me! I really wanted to create a magic system that felt grounded and had real weight to it.",
        timestamp: "2024-08-11T08:00:00Z",
        likes: 6,
        isLiked: false,
        isAuthor: true
      },
      {
        id: "reply-4",
        user: "MagicLore",
        content: "It really shows in your writing. The cost of magic makes every use feel important.",
        timestamp: "2024-08-11T09:00:00Z",
        likes: 4,
        isLiked: true,
        isAuthor: false
      },
      {
        id: "reply-5",
        user: "ReaderGirl",
        content: "I love how you've built the rules consistently throughout the series!",
        timestamp: "2024-08-11T09:30:00Z",
        likes: 2,
        isLiked: false,
        isAuthor: false
      }
    ],
    context: {
      novelTitle: "The Crystal Chronicles",
      chapterTitle: "Chapter 12: The Mage's Dilemma",
      chapterNumber: 12,
      paragraphSnippet: "Each spell demanded a price, and Lyra could feel the magic draining her life force with every incantation. The ancient tome had warned of this cost",
      author: "Elena Martinez"
    }
  },
  "thread-3": {
    id: "thread-3",
    originalComment: {
      id: "comment-3",
      user: "You",
      content: "Amazing cyberpunk atmosphere!",
      timestamp: "2024-08-11T06:00:00Z",
      likes: 4,
      isLiked: true
    },
    replies: [
      {
        id: "reply-6",
        user: "Alex Chen",
        content: "Thanks! I'm really trying to capture that gritty neon-soaked feeling.",
        timestamp: "2024-08-11T06:30:00Z",
        likes: 2,
        isLiked: true,
        isAuthor: true
      }
    ],
    context: {
      novelTitle: "Neon Dreams",
      chapterTitle: "Chapter 3: Data Hunt",
      chapterNumber: 3,
      paragraphSnippet: "The neon signs reflected off the rain-slicked streets, casting an electric blue glow over the shadowy figures moving through the alleyways",
      author: "Alex Chen"
    }
  },
  "thread-4": {
    id: "thread-4",
    originalComment: {
      id: "comment-4",
      user: "You",
      content: "Thank you for the kind words! I'm so glad you're enjoying the romance development...",
      timestamp: "2024-08-10T14:00:00Z",
      likes: 7,
      isLiked: false
    },
    replies: [
      {
        id: "reply-7",
        user: "Sarah Johnson",
        content: "Your character development is amazing! Keep up the great work!",
        timestamp: "2024-08-10T15:00:00Z",
        likes: 3,
        isLiked: true,
        isAuthor: true
      },
      {
        id: "reply-8",
        user: "RomanceReader",
        content: "The slow burn is perfect! Don't rush it.",
        timestamp: "2024-08-10T16:00:00Z",
        likes: 5,
        isLiked: false,
        isAuthor: false
      }
    ],
    context: {
      novelTitle: "Hearts in Harmony",
      chapterTitle: "Chapter 8: First Kiss",
      chapterNumber: 8,
      paragraphSnippet: "Their eyes met across the moonlit garden, and in that moment, everything else faded away. The world held its breath as he stepped closer",
      author: "Sarah Johnson"
    }
  }
}

// Helper function to get thread by message ID
export function getCommentThreadByMessageId(messageId: number): string | null {
  const threadMap: Record<number, string> = {
    11: "thread-1", // Your comment on Crystal Chronicles
    12: "thread-2", // FantasyFan comment on magic system  
    13: "thread-3", // Your comment on Neon Dreams
    14: "thread-4", // Your reply on Hearts in Harmony
  }
  
  return threadMap[messageId] || null
}
