# Scripts de Base de Datos

Este directorio contiene todos los scripts relacionados con la gestión de la base de datos, incluyendo seeders, scripts de limpieza y utilidades de verificación.

## 📁 Estructura del Directorio

```
prisma/
├── seeders/
│   ├── items.seeder.ts         # Seeder para productos y eventos
│   └── README.md               # Documentación de seeders
├── scripts/
│   ├── check-data.ts           # Verificar datos en la BD
│   └── clean-data.ts           # Limpiar datos de la BD
├── seed.ts                     # Script principal de seeding
├── schema.prisma               # Esquema de la base de datos
└── README.md                   # Este archivo
```

## 🚀 Comandos Disponibles

### Seeding (Poblar Base de Datos)

```bash
# Ejecutar todos los seeders
pnpm run seed

# Ejecutar seeder específico de items
pnpm run seed:items
```

### Verificación de Datos

```bash
# Verificar qué datos están en la BD
pnpm run db:check
```

### Limpieza de Datos

```bash
# Limpiar todos los datos (⚠️ CUIDADO)
pnpm run db:clean:all

# Limpiar solo productos y eventos
pnpm run db:clean:items

# Limpiar solo carritos y órdenes
pnpm run db:clean:transactions
```

## 📊 Datos Incluidos en el Seeder

### 📦 Productos (10 items)

| Producto | Precio | Categoría |
|----------|--------|-----------|
| Laptop Gaming ROG Strix | $1,299.99 | Electrónicos |
| iPhone 15 Pro Max | $1,199.00 | Electrónicos |
| Auriculares Sony WH-1000XM5 | $399.99 | Audio |
| Monitor 4K Dell UltraSharp | $649.99 | Electrónicos |
| Teclado Mecánico Keychron K8 | $89.99 | Accesorios |
| Mouse Logitech MX Master 3S | $99.99 | Accesorios |
| Cámara Canon EOS R6 Mark II | $2,499.00 | Fotografía |
| Tablet iPad Air M2 | $599.00 | Electrónicos |
| Smartwatch Apple Watch Series 9 | $429.00 | Wearables |
| Consola PlayStation 5 | $499.99 | Gaming |

### 🎉 Eventos (10 items)

| Evento | Precio | Fecha | Ubicación |
|--------|--------|-------|-----------|
| Conferencia Tech Summit 2024 | $299.00 | 15/03/2024 | Ciudad de México |
| Workshop de React y Next.js | $149.99 | 20/02/2024 | Guadalajara |
| Concierto Sinfónico de Año Nuevo | $85.00 | 01/01/2024 | Ciudad de México |
| Masterclass de Fotografía Digital | $199.00 | 10/02/2024 | Monterrey |
| Festival Gastronómico Internacional | $125.00 | 22/03/2024 | Puebla |
| Bootcamp de Data Science | $899.00 | 05/04/2024 | Ciudad de México |
| Exposición de Arte Contemporáneo | $45.00 | 05/02/2024 | Ciudad de México |
| Seminario de Emprendimiento Digital | $179.99 | 18/03/2024 | Guadalajara |
| Torneo de Esports FIFA 24 | $25.00 | 12/04/2024 | Monterrey |
| Retiro de Yoga y Meditación | $350.00 | 25/04/2024 | Tulum |

## 🔄 Flujo de Trabajo Típico

### Para Desarrollo Diario
```bash
# 1. Verificar estado actual
pnpm run db:check

# 2. Si necesitas datos frescos
pnpm run db:clean:items
pnpm run seed:items

# 3. Verificar que todo esté bien
pnpm run db:check
```

### Para Testing
```bash
# 1. Limpiar todo antes de tests
pnpm run db:clean:all

# 2. Poblar con datos de prueba
pnpm run seed

# 3. Ejecutar tests
pnpm run test
```

### Para Reset Completo
```bash
# ⚠️ CUIDADO: Esto elimina TODO
pnpm run db:clean:all
pnpm run seed
```

## ⚠️ Consideraciones de Seguridad

### Entornos
- **✅ Desarrollo**: Usar libremente todos los scripts
- **✅ Testing**: Usar para datos consistentes en pruebas
- **❌ Producción**: NUNCA ejecutar scripts de limpieza o seeding

### Verificaciones de Seguridad
Los scripts incluyen verificaciones básicas, pero siempre:
1. Verificar la variable `DATABASE_URL` antes de ejecutar
2. Hacer backup de datos importantes antes de limpiar
3. Probar en entorno de desarrollo primero

## 🛠️ Desarrollo y Mantenimiento

### Agregar Nuevos Seeders

1. **Crear archivo seeder**:
```typescript
// prisma/seeders/nuevo-seeder.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedNuevoModulo() {
  console.log('🌱 Seeding nuevo módulo...');

  // Tu lógica aquí

  console.log('✅ Nuevo módulo seeded');
}

if (require.main === module) {
  seedNuevoModulo().catch(console.error);
}
```

2. **Agregar al seed principal**:
```typescript
// prisma/seed.ts
import { seedNuevoModulo } from './seeders/nuevo-seeder';

async function main() {
  await seedItems();
  await seedNuevoModulo(); // Agregar aquí
}
```

3. **Agregar script pnpm**:
```json
{
  "scripts": {
    "seed:nuevo": "ts-node prisma/seeders/nuevo-seeder.ts"
  }
}
```

### Mejores Prácticas

1. **Datos Realistas**: Usar datos que reflejen casos de uso reales
2. **Variedad**: Incluir diferentes tipos de datos para testing completo
3. **Consistencia**: Mantener formato y estructura consistente
4. **Documentación**: Documentar qué datos se insertan y por qué
5. **Limpieza**: Manejar limpieza de datos apropiadamente
6. **Errores**: Implementar manejo robusto de errores
7. **Logging**: Proporcionar feedback claro del progreso

## 🐛 Troubleshooting

### Errores Comunes

#### "Database connection failed"
```bash
# Verificar que la BD esté ejecutándose
# Revisar variables de entorno
echo $DATABASE_URL

# Ejecutar migraciones
npx prisma migrate dev
```

#### "Table doesn't exist"
```bash
# Ejecutar migraciones
npx prisma migrate dev

# Regenerar cliente Prisma
npx prisma generate
```

#### "Unique constraint violation"
```bash
# Los datos ya existen, limpiar primero
pnpm run db:clean:items
pnpm run seed:items
```

#### "Permission denied"
```bash
# Verificar permisos de base de datos
# Verificar usuario y contraseña en DATABASE_URL
```

### Logs y Debugging

Para debugging detallado, puedes modificar temporalmente los seeders para incluir más logs:

```typescript
// Agregar al inicio del seeder
console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 20) + '...');

// Agregar después de cada operación
console.log('📊 Estado actual:', await prisma.product.count(), 'productos');
```

## 📚 Referencias y Recursos

- [Prisma Seeding Guide](https://www.prisma.io/docs/guides/database/seed-database)
- [NestJS Database Guide](https://docs.nestjs.com/techniques/database)
- [TypeScript Node.js Guide](https://nodejs.org/en/docs/guides/nodejs-typescript/)
- [Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

## 📝 Changelog

### v1.0.0 - Setup Inicial
- ✅ Seeder de productos y eventos
- ✅ Script de verificación de datos
- ✅ Scripts de limpieza de datos
- ✅ Documentación completa
- ✅ Integración con npm scripts
