import { PrismaClient } from '@prisma/client';

/**
 * Seeder para Items - Inserta datos de productos y eventos en la base de datos
 *
 * Este seeder proporciona datos de prueba para el desarrollo y testing,
 * incluyendo una variedad de productos y eventos con diferentes características.
 *
 * Características del seeder:
 * - Datos realistas para productos y eventos
 * - Precios variados para testing de cálculos
 * - Fechas futuras para eventos
 * - Descripciones detalladas para UI testing
 * - Imágenes de ejemplo para testing visual
 *
 * Uso:
 * - Desarrollo: Proporciona datos para probar la UI
 * - Testing: Datos consistentes para pruebas automatizadas
 * - Demo: Datos atractivos para presentaciones
 */

const prisma = new PrismaClient();

/**
 * Datos de productos para el seeder
 *
 * Incluye una variedad de productos con diferentes precios,
 * descripciones y características para testing completo.
 */
const productsData = [
  {
    name: 'Laptop Gaming ROG Strix',
    description: 'Laptop gaming de alta performance con RTX 4060, Intel i7 12th gen, 16GB RAM y SSD 1TB. Perfecta para gaming y trabajo profesional.',
    thumbnail: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
    unit: 1,
    unitPrice: 1299.99,
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'El último iPhone con chip A17 Pro, cámara de 48MP, pantalla Super Retina XDR de 6.7" y batería de larga duración.',
    thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    unit: 1,
    unitPrice: 1199.00,
  },
  {
    name: 'Auriculares Sony WH-1000XM5',
    description: 'Auriculares inalámbricos con cancelación de ruido líder en la industria, sonido Hi-Res y 30 horas de batería.',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    unit: 1,
    unitPrice: 399.99,
  },
  {
    name: 'Monitor 4K Dell UltraSharp',
    description: 'Monitor profesional 27" 4K UHD con precisión de color del 99% sRGB, ideal para diseño gráfico y edición de video.',
    thumbnail: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    unit: 1,
    unitPrice: 649.99,
  },
  {
    name: 'Teclado Mecánico Keychron K8',
    description: 'Teclado mecánico inalámbrico con switches Gateron, retroiluminación RGB y compatibilidad Mac/Windows.',
    thumbnail: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
    unit: 1,
    unitPrice: 89.99,
  },
  {
    name: 'Mouse Logitech MX Master 3S',
    description: 'Mouse ergonómico de precisión con sensor de 8000 DPI, scroll electromagnético y batería de 70 días.',
    thumbnail: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    unit: 1,
    unitPrice: 99.99,
  },
  {
    name: 'Cámara Canon EOS R6 Mark II',
    description: 'Cámara mirrorless full-frame con sensor de 24.2MP, video 4K 60p y estabilización de imagen de 8 stops.',
    thumbnail: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
    unit: 1,
    unitPrice: 2499.00,
  },
  {
    name: 'Tablet iPad Air M2',
    description: 'iPad Air con chip M2, pantalla Liquid Retina de 10.9", compatible con Apple Pencil y Magic Keyboard.',
    thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    unit: 1,
    unitPrice: 599.00,
  },
  {
    name: 'Smartwatch Apple Watch Series 9',
    description: 'Reloj inteligente con chip S9, pantalla Always-On más brillante, y nuevas funciones de salud y fitness.',
    thumbnail: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
    unit: 1,
    unitPrice: 429.00,
  },
  {
    name: 'Consola PlayStation 5',
    description: 'Consola de videojuegos de nueva generación con SSD ultra rápido, ray tracing y audio 3D inmersivo.',
    thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    unit: 1,
    unitPrice: 499.99,
  },
];

/**
 * Datos de eventos para el seeder
 *
 * Incluye eventos variados con fechas futuras, diferentes precios
 * y ubicaciones para testing completo del sistema.
 */
const eventsData = [
  {
    name: 'Conferencia Tech Summit 2024',
    description: 'La conferencia de tecnología más importante del año. Speakers internacionales, networking y las últimas tendencias en IA, blockchain y desarrollo.',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    unit: 1,
    unitPrice: 299.00,
    date: new Date('2024-03-15T09:00:00Z'),
    location: 'Centro de Convenciones, Ciudad de México',
    duration: '2 días',
  },
  {
    name: 'Workshop de React y Next.js',
    description: 'Taller intensivo de desarrollo web moderno con React 18, Next.js 14, TypeScript y las mejores prácticas de la industria.',
    thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400',
    unit: 1,
    unitPrice: 149.99,
    date: new Date('2024-02-20T10:00:00Z'),
    location: 'Campus Tecnológico, Guadalajara',
    duration: '8 horas',
  },
  {
    name: 'Concierto Sinfónico de Año Nuevo',
    description: 'Concierto especial de la Orquesta Sinfónica Nacional interpretando las mejores obras clásicas para recibir el nuevo año.',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    unit: 1,
    unitPrice: 85.00,
    date: new Date('2024-01-01T20:00:00Z'),
    location: 'Palacio de Bellas Artes, Ciudad de México',
    duration: '2.5 horas',
  },
  {
    name: 'Masterclass de Fotografía Digital',
    description: 'Aprende técnicas avanzadas de fotografía digital con un fotógrafo profesional. Incluye práctica con modelos y edición.',
    thumbnail: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400',
    unit: 1,
    unitPrice: 199.00,
    date: new Date('2024-02-10T14:00:00Z'),
    location: 'Estudio Creativo, Monterrey',
    duration: '6 horas',
  },
  {
    name: 'Festival Gastronómico Internacional',
    description: 'Degustación de platillos de chefs internacionales, maridajes con vinos y experiencias culinarias únicas.',
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    unit: 1,
    unitPrice: 125.00,
    date: new Date('2024-03-22T18:00:00Z'),
    location: 'Plaza Gastronómica, Puebla',
    duration: '4 horas',
  },
  {
    name: 'Bootcamp de Data Science',
    description: 'Programa intensivo de ciencia de datos con Python, machine learning, análisis estadístico y proyectos reales.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    unit: 1,
    unitPrice: 899.00,
    date: new Date('2024-04-01T09:00:00Z'),
    location: 'Instituto de Tecnología, Ciudad de México',
    duration: '5 días',
  },
  {
    name: 'Exposición de Arte Contemporáneo',
    description: 'Muestra de arte contemporáneo mexicano con obras de artistas emergentes y reconocidos. Incluye tour guiado.',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    unit: 1,
    unitPrice: 45.00,
    date: new Date('2024-02-05T11:00:00Z'),
    location: 'Museo de Arte Moderno, Ciudad de México',
    duration: '3 horas',
  },
  {
    name: 'Seminario de Emprendimiento Digital',
    description: 'Aprende a crear y escalar tu startup digital. Casos de éxito, estrategias de marketing digital y financiamiento.',
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
    unit: 1,
    unitPrice: 179.99,
    date: new Date('2024-03-08T16:00:00Z'),
    location: 'Hub de Innovación, Guadalajara',
    duration: '4 horas',
  },
  {
    name: 'Torneo de Esports FIFA 24',
    description: 'Competencia profesional de FIFA 24 con premios en efectivo. Abierto para todas las categorías y niveles.',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    unit: 1,
    unitPrice: 25.00,
    date: new Date('2024-02-14T15:00:00Z'),
    location: 'Arena Gaming, Monterrey',
    duration: '8 horas',
  },
  {
    name: 'Retiro de Yoga y Meditación',
    description: 'Fin de semana de relajación y bienestar con clases de yoga, meditación guiada y alimentación saludable.',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    unit: 1,
    unitPrice: 350.00,
    date: new Date('2024-03-30T08:00:00Z'),
    location: 'Centro de Bienestar, Valle de Bravo',
    duration: '2 días',
  },
];

/**
 * Función principal del seeder
 *
 * Ejecuta la inserción de datos de productos y eventos,
 * manejando errores y proporcionando feedback del proceso.
 */
async function seedItems() {
  try {
    console.log('🌱 Iniciando seeder de items...');

    // Limpiar datos existentes (opcional - comentar si no se desea)
    console.log('🧹 Limpiando datos existentes...');
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.event.deleteMany();

    // Insertar productos
    console.log('📦 Insertando productos...');
    const createdProducts = await prisma.product.createMany({
      data: productsData,
      skipDuplicates: true,
    });
    console.log(`✅ ${createdProducts.count} productos insertados`);

    // Insertar eventos
    console.log('🎉 Insertando eventos...');
    const createdEvents = await prisma.event.createMany({
      data: eventsData,
      skipDuplicates: true,
    });
    console.log(`✅ ${createdEvents.count} eventos insertados`);

    // Mostrar resumen
    const totalProducts = await prisma.product.count();
    const totalEvents = await prisma.event.count();

    console.log('\n📊 Resumen del seeder:');
    console.log(`   • Productos en BD: ${totalProducts}`);
    console.log(`   • Eventos en BD: ${totalEvents}`);
    console.log(`   • Total items: ${totalProducts + totalEvents}`);

    console.log('\n🎯 Seeder completado exitosamente!');

  } catch (error) {
    console.error('❌ Error ejecutando el seeder:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Ejecutar el seeder si se llama directamente
 */
if (require.main === module) {
  seedItems()
    .catch((error) => {
      console.error('💥 Error fatal en el seeder:', error);
      process.exit(1);
    });
}

export { seedItems };
