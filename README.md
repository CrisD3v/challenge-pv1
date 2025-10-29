# Challenge PV1

Una aplicación completa sobre un carrito de compras construida con arquitectura moderna y patrones de diseño avanzados.

## 🏗️ Arquitectura del Proyecto

Este proyecto está dividido en dos aplicaciones principales:

### 🛒 **Client** - Shopping Cart App (Next.js)
- **Framework**: Next.js 16 con TypeScript
- **Estado**: TanStack Query + Optimistic Updates
- **UI**: Atomic Design + shadcn/ui + Motion
- **Características**: Actualizaciones optimistas, fallback automático, modo offline

### 🚀 **API** - Backend NestJS
- **Framework**: NestJS 11 con Arquitectura Hexagonal
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Características**: CRUD completo, sistema de órdenes, validación robusta

## ✨ Características Principales

### Frontend (Client)
- ⚡ **Actualizaciones Optimistas** - 0ms de respuesta percibida
- 🔄 **Fallback Automático** - Funciona offline con mock data
- 🛒 **Carrito Inteligente** - Agregación automática y persistencia dual
- 📱 **Responsive Design** - Funciona en todos los dispositivos
- 🎨 **Atomic Design** - Arquitectura escalable de componentes
- 🔍 **Búsqueda en Tiempo Real** - Filtrado instantáneo

### Backend (API)
- 🏛️ **Arquitectura Hexagonal** - Separación clara de responsabilidades
- 📦 **Gestión Completa** - Productos, eventos, carritos y órdenes
- 🔍 **Búsqueda Avanzada** - Filtrado y paginación
- 📁 **Subida de Archivos** - Manejo de imágenes optimizado
- 🧪 **Testing Completo** - Cobertura de pruebas unitarias e integración
- 📊 **Seeding Automático** - Datos de ejemplo incluidos

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 20+
- pnpm (recomendado)
- Docker y Docker Compose (recomendado)
- PostgreSQL (solo para desarrollo local sin Docker)

## 🐳 Opción 1: Con Docker (Recomendado)

### 1. Clonar el repositorio
```bash
git clone https://github.com/CrisD3v/challenge-pv1.git
cd challenge-pv1
```

### 2. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.docker.example .env.docker

# Editar variables según tu configuración
# Para DB local: USE_LOCAL_DB=true (por defecto)
# Para DB nube: USE_LOCAL_DB=false y configurar DATABASE_URL
```

### 3. Ejecutar con Docker

#### Con Makefile (Windows: instalar Make o usar comandos directos)
```bash
# Ver todos los comandos disponibles
make help

# Desarrollo con DB local (PostgreSQL en Docker)
make dev-local

# Desarrollo con DB en la nube
make dev-cloud

# Desarrollo completo con hot reload
make dev-full

# Producción
make prod
```

#### Sin Makefile (comandos directos)
```bash
# Desarrollo con DB local
docker-compose --env-file .env.docker -f docker-compose.yml -f docker-compose.local.yml up --build

# Desarrollo con DB en la nube
docker-compose --env-file .env.docker -f docker-compose.yml -f docker-compose.cloud.yml up --build

# Parar servicios
docker-compose down
```

#### Scripts PowerShell para Windows
```powershell
# Desarrollo con DB local
.\scripts\dev-local.ps1

# Desarrollo con DB en la nube
.\scripts\dev-cloud.ps1

# Desarrollo completo con hot reload
.\scripts\dev-full.ps1
```

### 4. Acceder a la aplicación
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001/api
- **Database**: localhost:5432 (solo con DB local)

## 💻 Opción 2: Desarrollo Local (Sin Docker)

### 1. Configurar API (Backend)
```bash
cd api

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar DATABASE_URL en .env

# Configurar base de datos
npx prisma migrate dev
npx prisma generate
pnpm run seed

# Iniciar servidor
pnpm run start:dev
```

### 2. Configurar Client (Frontend)
```bash
cd client

# Instalar dependencias
pnpm install

# Configurar variables de entorno (opcional)
cp .env.example .env.local
# Editar NEXT_PUBLIC_API_URL si es necesario

# Iniciar aplicación
pnpm dev
```

### 3. Acceder a la aplicación
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001/api

## 🌐 Endpoints Principales

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products?search=laptop` - Buscar productos
- `POST /api/products` - Crear producto

### Eventos
- `GET /api/events` - Listar eventos
- `GET /api/events?search=conferencia` - Buscar eventos
- `POST /api/events` - Crear evento

### Carrito
- `POST /api/cart` - Crear carrito
- `POST /api/cart/{id}/items` - Añadir items
- `PUT /api/cart/{id}/items/{itemId}/quantity` - Actualizar cantidad

### Órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders` - Listar órdenes
- `PUT /api/orders/{id}/status` - Actualizar estado

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 16** - Framework React
- **TypeScript** - Type safety
- **TanStack Query** - Estado del servidor
- **shadcn/ui** - Componentes UI
- **Motion** - Animaciones
- **Tailwind CSS** - Estilos

### Backend
- **NestJS 11** - Framework Node.js
- **PostgreSQL** - Base de datos
- **Prisma ORM** - ORM y migraciones
- **class-validator** - Validación
- **Jest** - Testing

## 📁 Estructura del Proyecto

```
challenge-pv1/
├── client/                 # Frontend Next.js
│   ├── src/
│   │   ├── components/     # Atomic Design
│   │   ├── lib/           # Utilidades y API
│   │   ├── providers/     # Context providers
│   │   └── app/           # App Router
│   └── package.json
├── api/                   # Backend NestJS
│   ├── src/
│   │   ├── context/       # Contextos de dominio
│   │   ├── prisma/        # Configuracion de prisma
│   │   └── app.module.ts
│   ├── prisma/           # Esquemas y seeders
│   └── package.json
└── README.md
```

## 🎯 Funcionalidades Destacadas

### Modo Offline
El frontend funciona completamente sin API usando:
- Mock data automático (10 productos + 10 eventos)
- localStorage para persistencia
- UX idéntica al modo online

### Actualizaciones Optimistas
- UI se actualiza instantáneamente
- Sincronización en background
- Rollback automático en caso de error

### Sistema de Órdenes
- Estados controlados: PENDING → PROCESSING → COMPLETED
- Transiciones válidas y consistentes
- Creación optimista con sincronización robusta

## 🐳 Configuración Docker

### Servicios incluidos
- **frontend**: Next.js (Puerto 3000)
- **backend**: NestJS (Puerto 3001)
- **database**: PostgreSQL (Puerto 5432) - Solo con DB local
- **redis**: Cache (Puerto 6379) - Solo con DB local

### Archivos de configuración
- `docker-compose.yml` - Configuración base (frontend + backend)
- `docker-compose.local.yml` - + PostgreSQL local
- `docker-compose.cloud.yml` - + Configuración para DB externa
- `docker-compose.dev.yml` - + Hot reload para desarrollo
- `Makefile` - Comandos simplificados

### Comandos útiles
```bash
# Ver logs
make logs              # Todos los servicios
make logs-api          # Solo API
make logs-client       # Solo frontend

# Mantenimiento
make clean             # Limpiar contenedores y volúmenes
make restart           # Reiniciar servicios
make build             # Solo construir imágenes
```

## 🔧 Configuración de Variables de Entorno

### Para Docker
Edita `.env.docker` según tu configuración:

```env
# DB Local (por defecto)
USE_LOCAL_DB=true
DATABASE_URL=postgresql://postgres:password123@database:5432/ecommerce_db

# DB en la Nube
USE_LOCAL_DB=false
DATABASE_URL=postgresql://user:password@your-cloud-db.com:5432/prod_db
```

## 🔍 Troubleshooting

### Docker
```bash
# Si hay problemas con permisos (Windows)
# Ejecutar como administrador o usar WSL2

# Si los puertos están ocupados
# Cambiar puertos en docker-compose.yml

# Ver estado de servicios
docker-compose ps

# Limpiar todo y empezar de nuevo
make clean
make dev-local
```

### Desarrollo Local
```bash
# Si falla la conexión a la DB
# Verificar que PostgreSQL esté corriendo
# Verificar DATABASE_URL en .env

# Si fallan las migraciones
npx prisma migrate reset
npx prisma migrate dev
```

## 📚 Documentación Detallada

- [Client README](./client/README.md) - Documentación completa del frontend
- [API README](./api/README.md) - Documentación completa del backend
- [Docker README](./README-Docker.md) - Documentación completa de Docker

---

**🎯 Resultado**: Una aplicación completa, moderna y robusta que funciona perfectamente tanto online como offline, con arquitectura escalable y experiencia de usuario premium.
