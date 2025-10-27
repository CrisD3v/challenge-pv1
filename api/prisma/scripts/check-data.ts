import { PrismaClient } from '@prisma/client';

/**
 * Script para verificar los datos en la base de datos
 *
 * Este script proporciona una forma rápida de verificar qué datos
 * están actualmente en la base de datos, útil para debugging y
 * verificación después de ejecutar seeders.
 */

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Verificando datos en la base de datos...\n');

    // Contar registros
    const productCount = await prisma.product.count();
    const eventCount = await prisma.event.count();
    const cartCount = await prisma.cart.count();
    const orderCount = await prisma.order.count();

    console.log('📊 Resumen de datos:');
    console.log(`   • Productos: ${productCount}`);
    console.log(`   • Eventos: ${eventCount}`);
    console.log(`   • Carritos: ${cartCount}`);
    console.log(`   • Órdenes: ${orderCount}`);
    console.log(`   • Total items: ${productCount + eventCount}\n`);

    // Mostrar algunos productos
    if (productCount > 0) {
      console.log('📦 Productos (primeros 5):');
      const products = await prisma.product.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          unitPrice: true,
        },
      });

      products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} - $${product.unitPrice}`);
      });

      if (productCount > 5) {
        console.log(`   ... y ${productCount - 5} más`);
      }
      console.log('');
    }

    // Mostrar algunos eventos
    if (eventCount > 0) {
      console.log('🎉 Eventos (primeros 5):');
      const events = await prisma.event.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          unitPrice: true,
          date: true,
          location: true,
        },
      });

      events.forEach((event, index) => {
        const date = new Date(event.date).toLocaleDateString();
        console.log(`   ${index + 1}. ${event.name} - $${event.unitPrice}`);
        console.log(`      📅 ${date} | 📍 ${event.location}`);
      });

      if (eventCount > 5) {
        console.log(`   ... y ${eventCount - 5} más`);
      }
      console.log('');
    }

    // Verificar próximos eventos
    const upcomingEvents = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 3,
      select: {
        name: true,
        date: true,
        location: true,
      },
    });

    if (upcomingEvents.length > 0) {
      console.log('📅 Próximos eventos:');
      upcomingEvents.forEach((event, index) => {
        const date = new Date(event.date).toLocaleDateString();
        const time = new Date(event.date).toLocaleTimeString();
        console.log(`   ${index + 1}. ${event.name}`);
        console.log(`      🕐 ${date} ${time} | 📍 ${event.location}`);
      });
      console.log('');
    }

    console.log('✅ Verificación completada');

  } catch (error) {
    console.error('❌ Error verificando datos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar verificación si se llama directamente
if (require.main === module) {
  checkData()
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export { checkData };
