# Dockerfile para API (NestJS)
FROM node:20-alpine AS base

# Instalar pnpm
RUN npm install -g pnpm

# Dependencias
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar Prisma client (con DATABASE_URL temporal)
ENV DATABASE_URL="postgresql://temp:temp@temp:5432/temp"
RUN npx prisma generate

# Construir aplicación
RUN pnpm run build

# Compilar seeders manualmente
RUN npx tsc prisma/seed.ts --outDir dist/prisma --moduleResolution node --target es2020 --module commonjs --esModuleInterop true --allowSyntheticDefaultImports true --experimentalDecorators true --emitDecoratorMetadata true --skipLibCheck true --forceConsistentCasingInFileNames false --resolveJsonModule true || echo "Seeders compilation failed"

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs

# Copiar archivos necesarios
COPY --from=builder --chown=nestjs:nestjs /app/dist ./dist
COPY --from=builder --chown=nestjs:nestjs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nestjs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nestjs /app/package.json ./package.json

# Crear directorios necesarios
RUN mkdir -p uploads public && chown -R nestjs:nestjs uploads public

USER nestjs

EXPOSE 3001

# Script de inicio que ejecuta migraciones y seeders
COPY --chown=nestjs:nestjs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]
