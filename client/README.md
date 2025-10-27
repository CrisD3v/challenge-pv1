# 🛒 Shopping Cart App

Una aplicación de carrito de compras moderna construida con **Next.js 16**, **TanStack Query**, **Atomic Design** y **actualizaciones optimistas** para una experiencia de usuario premium.

## 🚀 Características Principales

- ✅ **Actualizaciones Optimistas** - UI instantánea (0ms de respuesta percibida)
- ✅ **Fallback Automático** - Funciona siempre, con o sin API
- ✅ **Validación de Stock** - Control inteligente de inventario
- ✅ **Sistema de Órdenes** - Flujo completo de checkout
- ✅ **Cache Inteligente** - TanStack Query con 5min stale time
- ✅ **Arquitectura Escalable** - Atomic Design + Patrones de Diseño
- ✅ **Animaciones Fluidas** - Framer Motion para UX premium
- ✅ **TypeScript** - Type safety completo
- ✅ **Responsive Design** - Funciona en todos los dispositivos

## 🏗️ Arquitectura del Proyecto

### 🧩 Atomic Design
```
components/
├── atoms/              # Componentes básicos reutilizables
│   ├── index.ts        # Re-exports de shadcn/ui
│   ├── loading-spinner.atom.tsx
│   └── status-indicator.atom.tsx
├── molecules/          # Combinaciones de atoms
│   ├── cart-button.molecule.tsx
│   ├── filter-tabs.molecule.tsx
│   └── item-card.molecule.tsx
├── organisms/          # Secciones complejas de UI
│   ├── cart-sidebar.organism.tsx
│   ├── header.organism.tsx
│   └── items-grid.organism.tsx
└── templates/          # Layouts de página completa
    └── shop-layout.tsx
```

### 🔄 Providers & Estado
```
providers/
├── cart-provider.tsx     # Estado optimista del carrito
├── orders-provider.tsx   # Sistema de órdenes
└── query-provider.tsx    # TanStack Query setup
```

### 🎯 Patrones de Diseño
```
lib/patterns/
├── filter-strategy.ts    # Strategy Pattern para filtros
└── item-factory.ts       # Factory Pattern para items
```

### 🌐 API & Estado
```
lib/
├── api/
│   ├── client.ts         # Configuración Axios
│   ├── fallback.ts       # Servicios fallback
│   └── services/         # Servicios API (products, events, cart, orders)
├── queries/              # TanStack Query hooks
├── optimistic-state.ts   # Sistema de estado optimista
└── mock-cart.ts          # Storage fallback offline
```

### Estado & Datos
- **TanStack Query 5** - Manejo de estado del servidor
- **Axios** - Cliente HTTP
- **Optimistic Updates** - Estado local inmediato

### UI Components
- **shadcn/ui** - Sistema de componentes
- **Lucide React** - Iconos modernos
- **Sonner** - Toast notifications

### Desarrollo
- **ESLint** - Linting
- **PostCSS** - Procesamiento CSS
- **Autoprefixer** - Compatibilidad CSS

## 🎨 Patrones Implementados

### 1. **Atomic Design**
Organización escalable de componentes desde elementos básicos hasta páginas completas.

### 2. **Optimistic Updates**
```typescript
// UI se actualiza inmediatamente
optimisticState.current.addItem(item)
updateDerivedStates()

// Sincronización en background
syncWithAPI()
```

### 3. **Strategy Pattern**
Sistema de filtros flexible y extensible.

### 4. **Factory Pattern**
Creación consistente de items (productos/eventos).

### 5. **Provider Pattern**
Manejo de estado global con contexto React.

## 🚀 Funcionalidades Avanzadas

### ⚡ Actualizaciones Optimistas
- **0ms de respuesta percibida** - UI actualiza instantáneamente
- **Sincronización en background** - API se actualiza sin bloquear UI
- **Rollback automático** - Revierte cambios si API falla
- **Estados de carga inteligentes** - Indicadores visuales apropiados

### 📦 Validación de Stock
- **Control multi-nivel** - Validación en UI, lógica y estado
- **Feedback visual** - Botones dinámicos según disponibilidad
- **Mensajes informativos** - Toast notifications claras
- **Prevención proactiva** - Evita operaciones inválidas

### 🛒 Sistema de Carrito Avanzado
- **Agregación automática** - Items duplicados se suman
- **Persistencia dual** - API + localStorage fallback
- **Cálculos en tiempo real** - Totales actualizados instantáneamente
- **Modo offline** - Funciona completamente sin API

### 📋 Sistema de Órdenes
- **Estados controlados** - PENDING → PROCESSING → COMPLETED
- **Transiciones válidas** - Flujo de estados consistente
- **Creación optimista** - Órdenes se crean instantáneamente
- **Sincronización robusta** - Manejo de errores transparente

### 🔄 Fallback Automático
- **Detección inteligente** - Identifica cuando API no está disponible
- **Transición transparente** - Usuario no nota el cambio
- **Datos mock completos** - 10 productos + 10 eventos
- **Funcionalidad completa** - Todas las features funcionan offline

## 🌐 Integración con API NestJS

### Configuración
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Endpoints Integrados
- **GET /api/products** - Lista productos con búsqueda
- **GET /api/events** - Lista eventos con búsqueda
- **POST /api/cart** - Crea nuevo carrito
- **POST /api/cart/{id}/items** - Añade items al carrito
- **PUT /api/cart/{id}/items/{itemId}/quantity** - Actualiza cantidades
- **DELETE /api/cart/{id}/items** - Limpia carrito
- **POST /api/orders** - Crea nueva orden
- **PUT /api/orders/{id}/status** - Actualiza estado de orden

### Flujo de Usuario Típico
1. **Explorar productos** → Búsqueda en tiempo real
2. **Agregar al carrito** → Respuesta instantánea + toast
3. **Ver carrito** → Sidebar animado con totales
4. **Checkout** → Orden creada instantáneamente
5. **Confirmación** → Toast + carrito limpio

## 🔧 Configuración de Desarrollo

### Requisitos
- **Node.js 18+**
- **pnpm** (recomendado) o npm
- **API NestJS** (opcional, tiene fallback)

### Instalación
```bash
# 1. Clonar repositorio
git clone https://github.com/CrisD3v/challenge-pv1.git
cd client

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno (opcional)
cp .env.example .env.local
# Editar NEXT_PUBLIC_API_URL si es necesario

# 4. Iniciar desarrollo
pnpm dev
```

### Modos de Operación

#### 🌐 Con API (Modo Completo)
- Datos persistidos en PostgreSQL
- Sincronización en tiempo real
- Funcionalidades completas de backend

#### 📱 Sin API (Modo Offline)
- Mock data automático (10 productos + 10 eventos)
- localStorage para persistencia
- Funcionalidad completa sin backend

### Métricas de Rendimiento
- **First Contentful Paint** - Optimizado con Next.js 16
- **Largest Contentful Paint** - Imágenes optimizadas
- **Cumulative Layout Shift** - Layout estable
- **Time to Interactive** - Carga progresiva

## 🎉 Casos de Uso

### E-commerce Completo
```bash
# 1. Explorar productos
GET /api/products?search=laptop

# 2. Agregar al carrito (optimista)
UI actualiza → Toast → Sync API

# 3. Checkout
Orden creada → Carrito limpio → Confirmación

# 4. Todo funciona offline también
Mock data → localStorage → UX idéntica
```

---

**🎯 Resultado**: Una aplicación de carrito de compras moderna, robusta y con experiencia de usuario que funciona perfectamente tanto online como offline.
