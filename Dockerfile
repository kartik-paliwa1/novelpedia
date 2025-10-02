# Stage 1: Builder
FROM node:18-alpine AS builder

# Accept build arguments
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET

# Set environment variables
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=$NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
ENV CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps && \
    npm cache clean --force

# Copy the prisma schema first and generate the client
# This layer is only invalidated if the prisma schema changes
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Install TypeScript explicitly to avoid build issues
RUN npm install --legacy-peer-deps --save-dev typescript

# Build the Next.js application
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine AS runner

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Copy utility scripts
COPY --from=builder /app/scripts ./scripts

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port 3000
EXPOSE 3000

# Ensure database schema is applied and optionally seed a dev user, then start
ENV SEED_TEST_USER=false \
    SEED_USER_EMAIL=test@example.com \
    SEED_USER_PASSWORD=Password123! \
    SEED_USER_USERNAME=devuser

CMD ["sh", "-lc", "npx prisma db push --skip-generate --accept-data-loss && node scripts/seed-dev-user.mjs || true; npm start"]
