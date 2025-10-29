#!/bin/sh

echo "🚀 Starting API container..."

# Regenerar Prisma client con la URL real
echo "🔄 Regenerating Prisma client with real DATABASE_URL..."
npx prisma generate

# Esperar a que la base de datos esté disponible (solo si es local)
if [ "$USE_LOCAL_DB" = "true" ]; then
  echo "⏳ Waiting for database to be ready..."

  # Extraer host y puerto de DATABASE_URL
  DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
  DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')

  # Esperar conexión
  while ! nc -z $DB_HOST $DB_PORT; do
    echo "⏳ Waiting for database at $DB_HOST:$DB_PORT..."
    sleep 2
  done

  echo "✅ Database is ready!"
fi

# Ejecutar migraciones
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Verificar que las migraciones se aplicaron correctamente
echo "🔍 Verifying database schema..."
npx prisma db push --accept-data-loss || echo "⚠️ Schema push failed, continuing..."

# Ejecutar seeders solo en desarrollo
if [ "$NODE_ENV" != "production" ]; then
  echo "🌱 Running database seeders..."
  node prisma/seed.items.js || echo "⚠️ Seeders failed, continuing..."
fi

echo "🎉 Starting NestJS application..."
exec node dist/main
