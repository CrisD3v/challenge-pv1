-- Script de inicialización para PostgreSQL
-- Se ejecuta automáticamente cuando se crea el contenedor de DB

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configuraciones de PostgreSQL para mejor rendimiento
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;
