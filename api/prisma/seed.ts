import { seedItems } from './seeders/items.seeder';

/**
 * Script principal de seeding - Ejecuta todos los seeders de la aplicación
 *
 * Este script coordina la ejecución de todos los seeders disponibles,
 * proporcionando una forma centralizada de poblar la base de datos con
 * datos de desarrollo y testing.
 *
 * Características:
 * - Ejecución secuencial de seeders
 * - Manejo centralizado de errores
 * - Logging detallado del progreso
 * - Desconexión segura de la base de datos
 *
 * Uso:
 * - npm run seed (para ejecutar todos los seeders)
 * - Desarrollo: Poblar BD con datos de prueba
 * - Testing: Datos consistentes para pruebas
 * - CI/CD: Preparar entornos de testing
 */

/**
 * Función principal que ejecuta todos los seeders
 */
async function main() {
  console.log('🚀 Iniciando proceso de seeding...\n');

  try {
    // Ejecutar seeder de items (productos y eventos)
    await seedItems();

    console.log('\n🎉 Todos los seeders ejecutados exitosamente!');
    console.log('💡 La base de datos está lista para desarrollo y testing.');

  } catch (error) {
    console.error('\n💥 Error durante el proceso de seeding:', error);
    throw error;
  }
}

// Ejecutar el seeder principal
main()
  .catch((error) => {
    console.error('❌ Error fatal en el proceso de seeding:', error);
    process.exit(1);
  });
