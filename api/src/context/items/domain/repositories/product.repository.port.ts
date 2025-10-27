import { Product } from '@context/items/domain/entities/product.entity';

/**
 * Puerto (interfaz) para el repositorio de productos
 * Define el contrato que debe implementar cualquier adaptador de persistencia
 */
export interface IProductRepository {
  /**
   * Busca un producto por su ID
   * @param id - ID del producto
   * @returns Producto encontrado o null si no existe
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Obtiene todos los productos
   * @returns Lista de todos los productos
   */
  findAll(): Promise<Product[]>;

  /**
   * Busca productos por nombre (búsqueda parcial)
   * @param name - Nombre o parte del nombre a buscar
   * @returns Lista de productos que coinciden con la búsqueda
   */
  findByName(name: string): Promise<Product[]>;

  /**
   * Obtiene productos disponibles (precio > 0)
   * @returns Lista de productos disponibles
   */
  findAvailable(): Promise<Product[]>;

  /**
   * Crea un nuevo producto
   * @param name - Nombre del producto
   * @param thumbnail - URL de la imagen (opcional)
   * @param description - Descripción del producto (opcional)
   * @param unit - Unidad del producto
   * @param unitPrice - Precio unitario
   * @returns Producto creado
   */
  create(
    name: string,
    thumbnail?: string,
    description?: string,
    unit?: number,
    unitPrice?: number,
  ): Promise<Product>;

  /**
   * Actualiza un producto existente
   * @param id - ID del producto a actualizar
   * @param name - Nuevo nombre (opcional)
   * @param thumbnail - Nueva URL de imagen (opcional)
   * @param description - Nueva descripción (opcional)
   * @param unit - Nueva unidad (opcional)
   * @param unitPrice - Nuevo precio unitario (opcional)
   * @returns Producto actualizado
   */
  update(
    id: string,
    name?: string,
    thumbnail?: string,
    description?: string,
    unit?: number,
    unitPrice?: number,
  ): Promise<Product>;

  /**
   * Elimina un producto
   * @param id - ID del producto a eliminar
   */
  delete(id: string): Promise<void>;
}
