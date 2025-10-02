# Development Due

This document lists all the backend and frontend issues that need to be addressed.

## Backend Issues

### Unused API Endpoints

The following API endpoints are not being used by the frontend and should be considered for adding to the frontend :

-   `GET /api/accounts/token/refresh/`
-   `POST /api/accounts/logout/`
-   `GET /api/featured/`
-   `GET /api/bookmarks/`
-   `GET, POST /api/tags/`
-   `GET, PUT, DELETE /api/tags/:id/`
-   `GET, POST /api/genres/`
-   `GET, PUT, DELETE /api/genres/:id/`
-   `GET, POST /api/reviews/`
-   `GET, PUT, DELETE /api/reviews/:id/`
-   `GET /api/chapters/:id/stats/`
-   `GET, POST /api/comments/`
-   `GET, PUT, DELETE /api/comments/:id/`

## Frontend Issues

### Missing Backend Connections

The following components are using placeholder data and are not connected to the backend:

-   `src/modules/dashboard/components/editor/chapter/chapter-reader.tsx`
-   `src/app/dashboard/novel/page.tsx`
-   `src/app/dashboard/novel/[novelslug]/[chapterslug]/page.tsx`
-   `src/modules/dashboard/components/editor/chapter/chapter-editor.tsx`
-   `src/modules/dashboard/components/community/community-content.tsx`
-   `src/modules/dashboard/components/community/post/post-card.tsx`
-   `src/modules/dashboard/components/messages/messages-content.tsx`

### Logical Bugs and Areas for Improvement

-   **Duplicated `isLoggedIn` function:** The `isLoggedIn` function is duplicated in several files. It should be moved to a single file and imported where it's needed.
-   **Inconsistent API calls:** Some components are making direct `fetch` calls, while others are using the `api.ts` service. This should be standardized to use the `api.ts` service everywhere.
-   **Missing error handling:** The `fetch` calls in some components are missing proper error handling.
-   **Hardcoded URLs:** The `fetch` calls are using a hardcoded URL (`http://127.0.0.1:8000`). This should be replaced with the `API_BASE_URL` from `src/services/api.ts`.
-   **Missing `getMyNovels` function in `api.ts`:** The `MyNovelsPage` component is fetching the user's novels directly, instead of using a function in `api.ts`. A `getMyNovels` function should be added to `api.ts`.
-   **`CreateNovelPage` not using `createNovel` from `api.ts`**: The `CreateNovelPage` is not using the `createNovel` function from `api.ts`.
-   **Social Logins are not implemented**: The social login buttons are present in the UI but are not functional.
-   **Password Reset is not fully implemented**: The password reset functionality is not fully implemented.
-   **Forum and Community Features**: The forum and community features are not connected to the backend.
-   **Messaging and Commenting System**: The messaging and commenting system is not fully implemented.
