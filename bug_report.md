# Bug Report: Frontend-Backend Integration & Feedback Loops

This document outlines the bugs and issues identified after connecting the Next.js frontend to the Django backend and testing the feedback loop functionalities.

---

## 1. Critical: Chapter Content Mismatch After Autosave

-   **ID:** BUG-001
-   **Severity:** Critical
-   **Status:** Open

### Description

The autosave feature for chapters is not reliably saving the latest content to the database. When a user is editing a chapter, the autosave function (`/api/chapters/{id}/autosave/`) is called, but the content saved to the backend is sometimes an older version of the chapter, leading to data loss.

### Steps to Reproduce

1.  Navigate to the editor for any chapter.
2.  Make several rapid changes to the chapter's content.
3.  Wait for the autosave function to trigger (or trigger it manually if possible).
4.  Refresh the page or navigate away and back to the chapter.

### Expected Result

The chapter content should be the latest version that was visible in the editor before the refresh.

### Actual Result

The chapter content reverts to an older state, and the most recent changes are lost.

### Technical Notes

This might be a race condition or an issue with how the frontend state is being captured before being sent to the backend. The `autosaveChapter` function in `src/services/api.ts` should be investigated.

---

## 2. Major: New Comments on Forum Posts Not Appearing in Real-Time

-   **ID:** BUG-002
-   **Severity:** Major
-   **Status:** Open

### Description

When a user posts a new comment on a forum post, the comment is successfully saved to the backend, but it does not appear on the frontend without a manual page refresh. This disrupts the user experience and makes the forum feel unresponsive.

### Steps to Reproduce

1.  Go to the community forum page (`/forums`).
2.  Open any forum post.
3.  Add a new comment and submit it.
4.  Observe the comments section.

### Expected Result

The new comment should appear in the comments section immediately after being submitted, without needing a page refresh.

### Actual Result

The new comment does not appear. The user has to manually refresh the page to see their comment.

### Technical Notes

The frontend is likely not re-fetching the comments data or updating the local state after a new comment is posted. The component responsible for displaying comments needs to be updated to handle this.

---

## 3. Minor: Incorrect Word Count for Chapters with Special Characters

-   **ID:** BUG-003
-   **Severity:** Minor
-   **Status:** Open

### Description

The word count for chapters is not always accurate, especially when the chapter contains special characters, such as em dashes (—) or ellipses (…). The backend and frontend seem to be calculating word counts differently.

### Steps to Reproduce

1.  Create a new chapter.
2.  Write a sentence that includes special characters, for example: "The journey was long... very long—and tiring."
3.  Save the chapter and observe the word count displayed on the chapter card.
4.  Compare this with the word count calculated by a standard word counter.

### Expected Result

The word count should be accurate and consistent between the frontend and backend.

### Actual Result

The word count is often off by a few words, which can be misleading for authors who are tracking their progress.

### Technical Notes

The word count logic on both the frontend and backend needs to be reviewed and standardized. The frontend might be using a simple `split(' ')` which is not robust enough.

---

## 4. Enhancement: Lack of User Feedback on Successful Actions

-   **ID:** ENH-001
-   **Severity:** Enhancement
-   **Status:** Open

### Description

The application does not provide clear feedback to the user when certain actions are successfully completed. For example, when a user creates a new novel or saves a chapter, there is no toast notification or success message to confirm that the action was successful.

### Steps to Reproduce

1.  Create a new novel.
2.  Save a chapter after making changes.

### Expected Result

A clear and visible notification (e.g., a toast message) should appear, confirming that the action was successful (e.g., "Novel created successfully" or "Chapter saved").

### Actual Result

The UI updates, but there is no explicit confirmation message, which can leave the user wondering if their action was successful.

### Technical Notes

A toast notification library (like `react-hot-toast` or similar) could be integrated to provide user feedback for important actions. The API client's methods could be wrapped to show these notifications on success or failure.
