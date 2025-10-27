/**
 * Entidad de dominio que representa un producto
 * Contiene la lógica de negocio relacionada con productos
 */
export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly thumbnail: string | null,
    public readonly description: string | null,
    public readonly unit: number,
    public readonly unitPrice: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) { }

  /**
   * Calcula el precio total basado en la cantidad
   * @param quantity - Cantidad de productos
   * @returns Precio total calculado
   */
  calculateTotalPrice(quantity: number): number {
    return this.unitPrice * quantity;
  }

  /**
   * Verifica si el producto está disponible (precio mayor a 0)
   * @returns true si el producto está disponible
   */
  isAvailable(): boolean {
    return this.unitPrice > 0;
  }

  /**
   * Verifica si el producto tiene imagen
   * @returns true si el producto tiene thumbnail
   */
  hasThumbnail(): boolean {
    return this.thumbnail !== null && this.thumbnail.length > 0;
  }

  /**
   * Obtiene un resumen del producto para mostrar
   * @returns Objeto con información resumida del producto
   */
  getSummary(): {
    id: string;
    name: string;
    unitPrice: number;
    isAvailable: boolean;
  } {
    return {
      id: this.id,
      name: this.name,
      unitPrice: this.unitPrice,
      isAvailable: this.isAvailable(),
    };
  }
}
