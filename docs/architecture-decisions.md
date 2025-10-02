# Architecture Decisions for API Integration and Auth

## Centralised API Client
- Replaced the standalone `api` object with an `ApiService` class so that request lifecycle rules (auth headers, retries, error wrapping) live in one place. 【F:src/services/api.ts†L224-L320】
- Added a private `createRequest` helper that prepares authenticated `fetch` calls and a `handleRequest` method that retries 401 responses after refreshing tokens. 【F:src/services/api.ts†L224-L315】
- All feature modules continue to consume the singleton `api` instance; no consumer changes were needed beyond removing direct `fetch` calls. 【F:src/services/api.ts†L693-L694】

## Environment-Driven Configuration
- Hardened API configuration by requiring `NEXT_PUBLIC_API_URL` during startup; misconfiguration now fails fast instead of falling back to localhost. 【F:src/config/api.ts†L1-L9】
- Test setup seeds a default API URL so unit tests can import the client without extra boilerplate. 【F:vitest.setup.ts†L1-L1】

## Auth Token Lifecycle
- Normalised auth helpers to be the single source of truth for token storage/refresh logic; UI layers now consume these helpers instead of re-implementing JWT parsing. 【F:src/utils/auth.ts†L1-L102】【F:tests/auth.utils.test.ts†L1-L69】
- Added coverage to guarantee expired tokens trigger a refresh and that login state reflects stored credentials. 【F:tests/auth.utils.test.ts†L33-L69】

## Quality Assurance & Testing
- Adopted Vitest for unit coverage of the API client and auth utilities, including retry logic and token refresh paths. 【F:tests/api.service.test.ts†L1-L96】【F:package.json†L6-L18】
- Stored environment defaults and mocks in dedicated setup files to keep tests hermetic. 【F:vitest.setup.ts†L1-L1】【F:tests/api.service.test.ts†L1-L96】

## Legacy Pages Alignment
- Updated legacy Next.js playgrounds under `Novel's Page/` and `Dashboard/` to consume the shared API service, eliminating hardcoded URLs and duplicate token logic. 【F:Novel's Page/src/app/auth/login/page.tsx†L1-L174】【F:Dashboard/src/app/auth/login/page.tsx†L1-L167】
- Manual network requests in archived prototypes (`NovelPedia-feat-backend-implementation/...`) now reuse the central client to stay compatible with the current stack. 【F:NovelPedia-feat-backend-implementation/xhave not used yet/auth branch backend/app/reset_password/page.tsx†L1-L60】
