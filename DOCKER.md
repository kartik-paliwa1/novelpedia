# Docker Guide

This guide walks through running the full NovelPedia stack with Docker. It relies on the provided `Dockerfile` for the Next.js frontend and the `docker-compose.yml` file that orchestrates both the frontend and Django backend services.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or the Docker Engine `>= 20.10`
- Docker Compose v2 (`docker compose` command). If you have an older setup that still uses `docker-compose`, upgrade or adjust the commands accordingly.

## Environment Variables

The Docker Compose file provides sane defaults, but you can customise behaviour with environment variables:

- `NEXT_PUBLIC_API_BASE_URL` controls where the frontend sends API requests. By default it points to the backend service URL (`http://backend:8000/api`).

If you need additional configuration, create a `.env` file in the repository root. Docker Compose automatically loads it, allowing you to override or extend settings without changing version-controlled files.

## Building and Starting the Stack

From the repository root run:

```bash
docker compose up --build
```

This command builds the frontend image (including the production Next.js build) and the backend image, applies Django migrations, then starts both services:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

Logs for both services stream to your terminal. Use `Ctrl+C` to stop them.

## Running in Detached Mode

To run the services in the background instead of streaming logs:

```bash
docker compose up --build -d
```

You can then inspect logs with `docker compose logs -f <service>` and stop the stack when finished:

```bash
docker compose down
```

## Executing Commands in Containers

Use `docker compose exec` to run one-off commands inside a service. Examples:

- Run Prisma migrations or generation inside the frontend container:
  ```bash
  docker compose exec frontend npx prisma migrate deploy
  docker compose exec frontend npx prisma generate
  ```
- Access the Django shell:
  ```bash
  docker compose exec backend python manage.py shell
  ```

## Persisted Data

The backend uses SQLite and bind-mounts `server/db.sqlite3` from your host machine. This means database changes survive container restarts. If you want a clean slate, remove that file before restarting the stack.

## Troubleshooting Tips

- **Port conflicts**: Ensure ports `3000` and `8000` are free. Adjust them in `docker-compose.yml` if needed.
- **Build caching**: Use `docker compose build --no-cache` if you suspect stale build artefacts.
- **Dependency changes**: After modifying `package.json` or backend dependencies, rerun `docker compose up --build` to rebuild images.

With these steps you should be able to spin up, interact with, and maintain the Dockerised development environment for NovelPedia with confidence.
