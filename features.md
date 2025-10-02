# Feature Inventory

## Fully Functional Frontend Experiences
- **Personalised landing page** – surfaces trending titles and latest releases through the central API service while rendering the home experience. 【F:src/app/page.tsx†L1-L56】
- **Credential-based authentication** – full email/username login with support for provider callbacks, social authorisation handshakes, and defensive messaging. 【F:src/app/login/page.tsx†L1-L164】
- **Account creation** – guided sign-up flow that validates agreements, enforces password confirmation, and issues a registration request through the API layer. 【F:src/app/signup/page.tsx†L1-L147】
- **Password recovery** – both reset link requests and token-confirmed password updates are wired to the shared API utility. 【F:src/app/reset-password/page.tsx†L1-L83】
- **Author workspace** – authors can create novels (with cover asset uploads), list their own catalogue, and load reader-ready chapters inside the dashboard. 【F:src/app/novel/create/page.tsx†L17-L123】【F:src/app/novel/my_novels/page.tsx†L1-L70】【F:src/app/dashboard/novel/page.tsx†L1-L160】
- **Profile overview** – authenticated users can fetch and render their account profile with fallback handling for missing data and expired sessions. 【F:src/app/profile/page.tsx†L1-L88】

## Backend Capabilities Ready for Integration
- **Discovery & analytics** – endpoints provide trending lists, latest releases, and dashboard-wide statistics for future visualisations. 【F:src/services/api.ts†L450-L460】
- **Community content** – posts, featured collections, bookmarks, and social metadata are all exposed for feed/forum experiences. 【F:src/services/api.ts†L462-L507】
- **Library taxonomy** – genre and tag CRUD APIs are centralised for categorisation workflows. 【F:src/services/api.ts†L508-L532】
- **Feedback loops** – reviews, per-chapter stats, and full comment threads (including CRUD) are available for reader engagement features. 【F:src/services/api.ts†L533-L595】
- **Account lifecycle** – registration, profile retrieval, password reset, and JWT refresh endpoints are standardised in the shared service. 【F:src/services/api.ts†L596-L628】
- **Social & notifications** – OAuth provider discovery, login/callback flows, and notification management endpoints are implemented for richer community interactions. 【F:src/services/api.ts†L632-L690】
