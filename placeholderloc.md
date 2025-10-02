# Placeholder Locations

This document lists the locations of placeholders found in the codebase and their descriptions.

## 1. `src/modules/dashboard/components/editor/chapter/chapter-reader.tsx`

*   **Location:** `src/modules/dashboard/components/editor/chapter/chapter-reader.tsx`
*   **Placeholder:** `sampleContent`
*   **Description:** This component uses a hardcoded `sampleContent` variable to display chapter text. This should be replaced with actual chapter content fetched from the backend.

## 2. `src/app/dashboard/novel/page.tsx`

*   **Location:** `src/app/dashboard/novel/page.tsx`
*   **Placeholder:** Mock data for `novels` and `chapters`
*   **Description:** This page uses mock data to display a list of novels and chapters. This should be replaced with actual data fetched from the API.

## 3. `src/app/dashboard/novel/[novelslug]/[chapterslug]/page.tsx`

*   **Location:** `src/app/dashboard/novel/[novelslug]/[chapterslug]/page.tsx`
*   **Placeholder:** Hardcoded chapter data
*   **Description:** This page uses hardcoded chapter data and should be replaced with a dynamic data fetching mechanism based on the provided slugs.

## 4. `src/modules/dashboard/components/editor/chapter/chapter-editor.tsx`

*   **Location:** `src/modules/dashboard/components/editor/chapter/chapter-editor.tsx`
*   **Placeholder:** `defaultContent` in `useEffect`
*   **Description:** The editor provides a default placeholder content for new chapters. While helpful, this is still a form of placeholder and should be noted.

## 5. `src/modules/dashboard/components/community/community-content.tsx`

*   **Location:** `src/modules/dashboard/components/community/community-content.tsx`
*   **Placeholder:** `mockPosts`, `handleNewPost`, `handleSaveDraft`, `handleUpvote`, `handleDownvote`, `handleReply`, `handleSave`, `handleShare`, `handleReport`
*   **Description:** This component uses mock data for forum posts and has placeholder functions for all interactions. The entire forum feature is not connected to the backend.

## 6. `src/modules/dashboard/components/community/post/post-card.tsx`

*   **Location:** `src/modules/dashboard/components/community/post/post-card.tsx`
*   **Placeholder:** `onUpvote`, `onDownvote`, `onReply`, `onSave`, `onShare`, `onReport`
*   **Description:** This component uses placeholder functions for all interactions.

## 7. `src/modules/dashboard/components/messages/messages-content.tsx`

*   **Location:** `src/modules/dashboard/components/messages/messages-content.tsx`
*   **Placeholder:** `allMessages`, `mockCommentThreads`, `handleArchive`, `handleDelete`, `handleMarkAllRead`, `handleMarkAllUnread`, `handleMessageClick`, `handleCloseThreadDialog`, `handleViewChapter`, `handleLikeComment`
*   **Description:** This component uses mock data for messages and comment threads, and has placeholder functions for all interactions. The entire messaging and commenting system is not fully implemented.