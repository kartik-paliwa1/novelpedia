# Remaining Bugs & Open Questions

The latest lint pass completed successfully, but a few areas still require manual verification:

1. **OAuth callback routing** – Social authentication flows depend on third-party redirect URIs that have not been validated in this environment. Confirm provider configuration on the backend and ensure callback URLs are whitelisted.
2. **Realtime messaging socket** – WebSocket connectivity is assumed to be exposed at `NEXT_PUBLIC_REALTIME_URL` (or inferred from the API base). Test against a live backend to ensure comment and notification events arrive as expected.
3. **Comment reply permissions** – Reply buttons are disabled when the API client rejects comment submissions, but end-to-end authorization (e.g. for anonymous users) still needs to be exercised against real credentials.
4. **Thread dialog retry** – When the thread API is unavailable, the dialog now surfaces a retry action. Verify that repeated failures are gracefully handled and that the dialog closes cleanly after recovery.
5. **Docker toolchain** – Docker CLI is unavailable in this workspace, so container orchestration could not be validated. Run `docker compose config` locally once the tooling is installed.

No additional automated suites are available; prioritize staging tests that cover full social login, comment moderation, and realtime updates when backend services are reachable.
