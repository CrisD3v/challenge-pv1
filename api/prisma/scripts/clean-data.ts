import { PrismaClient } from '@prisma/client';

/**
 * Script para limpiar datos de la base de datos
 *
 * Este script proporciona una forma segura de limpiar datos de desarrollo
 * y testing de la base de datos. Útil para resetear el estado antes de
 * ejecutar nuevos seeders o pruebas.
 *
 * ⚠️ ADVERTENCIA: Este script elimina datos permanentemente.
 * Solo usar en entornos de desarrollo y testing.
 */

const prisma = new PrismaClient();

/**
 * Opciones de limpieza disponibles
 */
interface CleanOptions {
  /** Limpiar elementos de carritos */
  cartItems?: boolean;
  /** Limpiar elementos de órdenes */
  orderItems?: boolean;
  /** Limpiar carritos completos */
  carts?: boolean;
  /** Limpiar órdenes completas */
  orders?: boolean;
  /** Limpiar productos */
  products?: boolean;
  /** Limpiar eventos */
  events?: boolean;
  /** Limpiar archivos subidos */
  files?: boolean;
  /** Limpiar todo */
  all?: boolean;
}

/**
 * Limpia datos específicos según las opciones proporcionadas
 */
async function cleanData(options: CleanOptions = {}) {
  try {
    console.log('🧹 Iniciando limpieza de datos...\n');

    let totalDeleted = 0;

    // Si se especifica 'all', activar todas las opciones
    if (options.all) {
      options = {
        cartItems: true,
        orderItems: true,
        carts: true,
        orders: true,
        products: true,
        events: true,
        files: true,
      };
    }

    // Limpiar en orden correcto (respetando foreign keys)

    // 1. Elementos de carritos (dependen de carritos y productos/eventos)
    if (options.cartItems) {
      console.log('🗑️  Eliminando elementos de carritos...');
      const result = await prisma.cartItem.deleteMany();
      console.log(`   ✅ ${result.count} elementos de carritos eliminados`);
      totalDeleted += result.count;
    }

    // 2. Elementos de órdenes (dependen de órdenes y productos/eventos)
    if (options.orderItems) {
      console.log('🗑️  Eliminando elementos de órdenes...');
      const result = await prisma.orderItem.deleteMany();
      console.log(`   ✅ ${result.count} elementos de órdenes eliminados`);
      totalDeleted += result.count;
    }

    // 3. Carritos (después de eliminar sus elementos)
    if (options.carts) {
      console.log('🗑️  Eliminando carritos...');
      const result = await prisma.cart.deleteMany();
      console.log(`   ✅ ${result.count} carritos eliminados`);
      totalDeleted += result.count;
    }

    // 4. Órdenes (después de eliminar sus elementos)
    if (options.orders) {
      console.log('🗑️  Eliminando órdenes...');
      const result = await prisma.order.deleteMany();
      console.log(`   ✅ ${result.count} órdenes eliminadas`);
      totalDeleted += result.count;
    }

    // 5. Productos (después de eliminar referencias)
    if (options.products) {
      console.log('🗑️  Eliminando productos...');
      const result = await prisma.product.deleteMany();
      console.log(`   ✅ ${result.count} productos eliminados`);
      totalDeleted += result.count;
    }

    // 6. Eventos (después de eliminar referencias)
    if (options.events) {
      console.log('🗑️  Eliminando eventos...');
      const result = await prisma.event.deleteMany();
      console.log(`   ✅ ${result.count} eventos eliminados`);
      totalDeleted += result.count;
    }

    // 7. Archivos subidos
    if (options.files) {
      console.log('🗑️  Eliminando archivos...');
      const result = await prisma.uploadedFile.deleteMany();
      console.log(`   ✅ ${result.count} archivos eliminados`);
      totalDeleted += result.count;
    }

    console.log(`\n📊 Resumen de limpieza:`);
    console.log(`   • Total registros eliminados: ${totalDeleted}`);

    if (totalDeleted === 0) {
      console.log('   ℹ️  No se eliminaron registros (base de datos ya estaba limpia o no se especificaron opciones)');
    }

    console.log('\n✅ Limpieza completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Función para limpieza completa (todos los datos)
 */
async function cleanAll() {
  console.log('⚠️  ADVERTENCIA: Esta operación eliminará TODOS los datos de la base de datos.');
  console.log('   Solo continúa si estás seguro de que quieres proceder.\n');

  await cleanData({ all: true });
}

/**
 * Función para limpieza solo de items (productos y eventos)
 */
async function cleanItems() {
  console.log('🧹 Limpiando solo productos y eventos (y sus referencias)...\n');

  await cleanData({
    cartItems: true,
    orderItems: true,
    products: true,
    events: true,
  });
}

/**
 * Función para limpieza solo de transacciones (carritos y órdenes)
 */
async function cleanTransactions() {
  console.log('🧹 Limpiando solo carritos y órdenes...\n');

  await cleanData({
    cartItems: true,
    orderItems: true,
    carts: true,
    orders: true,
  });
}

// Ejecutar según argumentos de línea de comandos
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  switch (command) {
    case 'all':
      cleanAll().catch(console.error);
      break;
    case 'items':
      cleanItems().catch(console.error);
      break;
    case 'transactions':
      cleanTransactions().catch(console.error);
      break;
    case 'help':
    default:
      console.log('🧹 Script de limpieza de datos\n');
      console.log('Uso:');
      console.log('  pnpm run db:clean:all          # Eliminar todos los datos');
      console.log('  pnpm run db:clean:items        # Eliminar solo productos y eventos');
      console.log('  pnpm run db:clean:transactions # Eliminar solo carritos y órdenes');
      console.log('\nComandos directos:');
      console.log('  pnpm exec ts-node prisma/scripts/clean-data.ts all');
      console.log('  pnpm exec ts-node prisma/scripts/clean-data.ts items');
      console.log('  pnpm exec ts-node prisma/scripts/clean-data.ts transactions');
      console.log('\n⚠️  ADVERTENCIA: Estos comandos eliminan datos permanentemente.');
      console.log('   Solo usar en entornos de desarrollo y testing.');
      break;
  }
}

export { cleanAll, cleanData, cleanItems, cleanTransactions };
