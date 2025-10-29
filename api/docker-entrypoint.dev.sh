#!/bin/sh

echo "🚀 Starting API in development mode..."

# Regenerar Prisma client con la URL real
echo "🔄 Regenerating Prisma client with real DATABASE_URL..."
npx prisma generate

# Esperar a que la base de datos esté disponible
echo "⏳ Waiting for database to be ready..."
while ! nc -z database 5432; do
  echo "⏳ Waiting for database..."
  sleep 2
done

echo "✅ Database is ready!"

# Ejecutar migraciones
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init || npx prisma migrate deploy

# Ejecutar seeders
echo "🌱 Running database seeders..."
npx ts-node prisma/seed.ts || echo "⚠️ Seeders failed, continuing..."

echo "🎉 Starting NestJS in development mode..."
exec pnpm start:dev
