# E-Commerce API - NestJS con Arquitectura Hexagonal

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Descripción

API REST completa para e-commerce construida con NestJS, implementando arquitectura hexagonal y principios de Clean Architecture. Soporta gestión de productos, eventos, carritos de compras y órdenes con funcionalidades avanzadas de búsqueda y filtrado.

## 🚀 Características Principales

- **Arquitectura Hexagonal**: Separación clara entre dominio, aplicación e infraestructura
- **Gestión de Productos y Eventos**: CRUD completo con búsqueda y filtrado
- **Carrito de Compras**: Funcionalidades avanzadas con agregación automática
- **Sistema de Órdenes**: Gestión completa con estados y transiciones
- **Subida de Archivos**: Manejo de imágenes con validación y optimización
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Validación Robusta**: DTOs con class-validator
- **Testing Completo**: Cobertura de pruebas unitarias e integración
- **Documentación**: Documentación completa de API y arquitectura

## 🛠️ Stack Tecnológico

- **Framework**: NestJS 11.x
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Validación**: class-validator, class-transformer
- **Testing**: Jest
- **Gestión de Archivos**: Multer
- **Arquitectura**: Hexagonal/Clean Architecture

## 📋 Requisitos Previos

- Node.js 18+
- pnpm
- PostgreSQL
- Git

## ⚡ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd api
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar variables necesarias
DATABASE_URL="postgresql://usuario:password@localhost:5432/ecommerce_db"
```

### 4. Configurar base de datos
```bash
# Ejecutar migraciones
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate

# Poblar con datos de ejemplo
pnpm run seed
```

### 5. Iniciar el servidor
```bash
# Desarrollo
pnpm run start:dev

# Producción
pnpm run start:prod
```

El servidor estará disponible en: **http://localhost:3000/api**

## 🗄️ Scripts de Base de Datos

### Seeding (Poblar BD)
```bash
pnpm run seed              # Ejecutar todos los seeders
pnpm run seed:items        # Solo productos y eventos
```

### Verificación
```bash
pnpm run db:check          # Ver estado actual de la BD
```

### Limpieza
```bash
pnpm run db:clean:all          # ⚠️ Eliminar TODOS los datos
pnpm run db:clean:items        # Solo productos y eventos
pnpm run db:clean:transactions # Solo carritos y órdenes
```

### Flujo de Desarrollo Típico
```bash
pnpm run db:check           # 1. Ver estado actual
pnpm run db:clean:items     # 2. Limpiar items si es necesario
pnpm run seed:items         # 3. Poblar con datos frescos
pnpm run db:check           # 4. Verificar resultado
```

## 🌐 API Endpoints

### Productos
```bash
# Obtener todos los productos
curl -X GET "http://localhost:3000/api/products"

# Buscar productos
curl -X GET "http://localhost:3000/api/products?search=laptop"

# Obtener producto por ID
curl -X GET "http://localhost:3000/api/products/1"

# Crear producto
curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming",
    "description": "Laptop para gaming de alta gama",
    "unitPrice": 1299.99,
    "unit": 1,
    "thumbnail": "https://example.com/laptop.jpg"
  }'

# Actualizar producto
curl -X PUT "http://localhost:3000/api/products/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming Pro",
    "unitPrice": 1499.99
  }'

# Eliminar producto
curl -X DELETE "http://localhost:3000/api/products/1"
```

### Eventos
```bash
# Obtener todos los eventos
curl -X GET "http://localhost:3000/api/events"

# Buscar eventos
curl -X GET "http://localhost:3000/api/events?search=conferencia"

# Obtener evento por ID
curl -X GET "http://localhost:3000/api/events/1"

# Crear evento
curl -X POST "http://localhost:3000/api/events" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Conferencia Tech 2024",
    "description": "Conferencia de tecnología",
    "unitPrice": 299.00,
    "unit": 1,
    "date": "2024-12-15T10:00:00Z",
    "location": "Centro de Convenciones",
    "duration": 480,
    "thumbnail": "https://example.com/conference.jpg"
  }'

# Actualizar evento
curl -X PUT "http://localhost:3000/api/events/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Conferencia Tech 2024 - Actualizada",
    "unitPrice": 349.00
  }'

# Eliminar evento
curl -X DELETE "http://localhost:3000/api/events/1"
```

### Carrito de Compras
```bash
# Crear carrito
curl -X POST "http://localhost:3000/api/cart"

# Obtener carrito
curl -X GET "http://localhost:3000/api/cart/cart-id"

# Añadir item al carrito
curl -X POST "http://localhost:3000/api/cart/cart-id/items" \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "PRODUCT",
    "productId": "product-id",
    "quantity": 2,
    "unitPrice": 99.99
  }'

# Añadir o incrementar item
curl -X POST "http://localhost:3000/api/cart/cart-id/items/add-or-increment" \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "PRODUCT",
    "productId": "product-id",
    "quantity": 1,
    "unitPrice": 99.99
  }'

# Actualizar cantidad
curl -X PUT "http://localhost:3000/api/cart/cart-id/items/item-id/quantity" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'

# Decrementar cantidad
curl -X PUT "http://localhost:3000/api/cart/cart-id/items/item-id/decrement"

# Limpiar carrito
curl -X DELETE "http://localhost:3000/api/cart/cart-id/items"
```

### Órdenes
```bash
# Crear orden
curl -X POST "http://localhost:3000/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "itemType": "PRODUCT",
        "productId": "product-id",
        "quantity": 2,
        "unitPrice": 99.99
      },
      {
        "itemType": "EVENT",
        "eventId": "event-id",
        "quantity": 1,
        "unitPrice": 299.00
      }
    ]
  }'

# Obtener todas las órdenes
curl -X GET "http://localhost:3000/api/orders"

# Filtrar órdenes por estado
curl -X GET "http://localhost:3000/api/orders?status=PENDING"

# Obtener orden por ID
curl -X GET "http://localhost:3000/api/orders/order-id"

# Actualizar estado de orden
curl -X PUT "http://localhost:3000/api/orders/order-id/status" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PROCESSING"
  }'

# Cancelar orden
curl -X PUT "http://localhost:3000/api/orders/order-id/cancel"

# Obtener estadísticas
curl -X GET "http://localhost:3000/api/orders/stats"
```

### Subida de Archivos
```bash
# Subir archivo
curl -X POST "http://localhost:3000/api/uploads" \
  -F "file=@/path/to/image.jpg"

# Obtener archivo
curl -X GET "http://localhost:3000/uploads/filename.jpg"

# Eliminar archivo
curl -X DELETE "http://localhost:3000/api/uploads/file-id"
```

## 🏗️ Arquitectura

### Estructura de Directorios
```
src/
├── context/                    # Contextos de dominio
│   ├── items/                 # Gestión de productos y eventos
│   │   ├── domain/           # Entidades y reglas de negocio
│   │   ├── application/      # Casos de uso
│   │   └── infrastructure/   # Controladores y repositorios
│   ├── cart/                 # Carrito de compras
│   ├── orders/               # Gestión de órdenes
│   ├── uploads/              # Subida de archivos
│   └── health/               # Health checks
├── shared/                    # Código compartido
└── app.module.ts             # Módulo principal

prisma/
├── seeders/                  # Scripts de seeding
├── scripts/                  # Utilidades de BD
├── schema.prisma            # Esquema de base de datos
└── seed.ts                  # Script principal de seeding

docs/                         # Documentación
├── README.md                # Documentación de Items
├── README_CART.md           # Documentación de Cart
├── README_ORDERS.md         # Documentación de Orders
└── COMMANDS.md              # Comandos de BD
```

### Principios de Arquitectura Hexagonal

#### Capa de Dominio
- **Entidades**: Lógica de negocio pura
- **Repositorios**: Interfaces (puertos)
- **Excepciones**: Errores específicos del dominio

#### Capa de Aplicación
- **Casos de Uso**: Orquestación de la lógica
- **DTOs**: Validación de entrada/salida

#### Capa de Infraestructura
- **Controladores**: Endpoints HTTP
- **Repositorios**: Implementaciones con Prisma
- **Servicios externos**: Integraciones

## 📊 Datos de Ejemplo

El seeder incluye:

### Productos (10 items)
- Laptop Gaming ROG Strix - $1,299.99
- iPhone 15 Pro Max - $1,199.00
- Auriculares Sony WH-1000XM5 - $399.99
- Monitor 4K Dell UltraSharp - $649.99
- Y más...

### Eventos (10 items)
- Conferencia Tech Summit 2024 - $299.00
- Workshop de React y Next.js - $149.99
- Concierto Sinfónico de Año Nuevo - $85.00
- Masterclass de Fotografía Digital - $199.00
- Y más...

## 🧪 Testing

```bash
# Ejecutar todas las pruebas
pnpm run test

# Pruebas en modo watch
pnpm run test:watch

# Cobertura de pruebas
pnpm run test:cov

# Pruebas e2e
pnpm run test:e2e

# Pruebas específicas por contexto
pnpm run test -- --testPathPatterns="src/context/items"
pnpm run test -- --testPathPatterns="src/context/cart"
pnpm run test -- --testPathPatterns="src/context/orders"
```

## 🔧 Desarrollo

### Comandos de Desarrollo
```bash
# Desarrollo con hot reload
pnpm run start:dev

# Modo debug
pnpm run start:debug

# Linting
pnpm run lint

# Formateo de código
pnpm run format
```

### Base de Datos
```bash
# Ver estado de migraciones
npx prisma migrate status

# Crear nueva migración
npx prisma migrate dev --name nombre-migracion

# Resetear base de datos
npx prisma migrate reset

# Abrir Prisma Studio
npx prisma studio
```

## 🚀 Despliegue

### Preparación para Producción
```bash
# Construir aplicación
pnpm run build

# Ejecutar migraciones en producción
npx prisma migrate deploy

# Iniciar en modo producción
pnpm run start:prod
```

### Variables de Entorno Requeridas
```env
DATABASE_URL="postgresql://user:password@localhost:5432/db"
PORT=3000
NODE_ENV=production
```

## 📚 Documentación Adicional

- [Documentación de Items](./docs/README.md) - Productos y eventos
- [Documentación de Cart](./docs/README_CART.md) - Carrito de compras
- [Documentación de Orders](./docs/README_ORDERS.md) - Sistema de órdenes
- [Comandos de BD](./docs/COMMANDS.md) - Scripts de base de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte y preguntas:
- Crear un issue en GitHub
- Revisar la documentación en `/docs`
- Verificar los logs del servidor

## 🔄 Estados de Órdenes

```
PENDING → PROCESSING → COMPLETED
   ↓           ↓
CANCELLED   CANCELLED
```

## ⚠️ Consideraciones Importantes

- **Desarrollo**: Usar scripts de seeding libremente
- **Testing**: Limpiar BD antes de ejecutar pruebas
- **Producción**: NUNCA ejecutar scripts de limpieza
- **Backup**: Hacer respaldo antes de operaciones destructivas

---

Construido con ❤️ usando NestJS y Arquitectura Hexagonal
