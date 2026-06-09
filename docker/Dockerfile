FROM oven/bun:1-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Dev: src/ mounted as volume for hot-reload
FROM deps AS development
ENV NODE_ENV=development
CMD ["bun", "--watch", "src/app/index.ts"]

# Prod: source code baked into the image
FROM deps AS production
ENV NODE_ENV=production
COPY src ./src
COPY tsconfig.json .
CMD ["bun", "run", "src/app/index.ts"]
