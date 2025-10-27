/**
 * Enum para los tipos de item
 */
export enum ItemType {
  PRODUCT = 'PRODUCT',
  EVENT = 'EVENT',
}

/**
 * Entidad de dominio que representa un item de orden
 * Contiene la lógica de negocio relacionada con items de órdenes
 */
export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly itemType: ItemType,
    public readonly productId: string | null,
    public readonly eventId: string | null,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly createdAt: Date,
  ) { }

  /**
   * Calcula el subtotal del item (cantidad × precio unitario)
   * @returns Subtotal del item
   */
  getSubtotal(): number {
    return this.quantity * this.unitPrice;
  }

  /**
   * Verifica si el item es un producto
   * @returns true si el item es un producto
   */
  isProduct(): boolean {
    return this.itemType === ItemType.PRODUCT && this.productId !== null;
  }

  /**
   * Verifica si el item es un evento
   * @returns true si el item es un evento
   */
  isEvent(): boolean {
    return this.itemType === ItemType.EVENT && this.eventId !== null;
  }

  /**
   * Obtiene el ID del item (productId o eventId según el tipo)
   * @returns ID del item
   */
  getItemId(): string | null {
    return this.isProduct() ? this.productId : this.eventId;
  }

  /**
   * Verifica si la cantidad es válida
   * @returns true si la cantidad es mayor a 0
   */
  hasValidQuantity(): boolean {
    return this.quantity > 0;
  }

  /**
   * Verifica si el precio unitario es válido
   * @returns true si el precio unitario es mayor o igual a 0
   */
  hasValidPrice(): boolean {
    return this.unitPrice >= 0;
  }

  /**
   * Verifica si el item tiene datos válidos
   * @returns true si el item es válido
   */
  isValid(): boolean {
    const hasValidType = this.itemType === ItemType.PRODUCT || this.itemType === ItemType.EVENT;
    const hasValidReference =
      (this.isProduct() && this.productId !== null) ||
      (this.isEvent() && this.eventId !== null);

    return hasValidType && hasValidReference && this.hasValidQuantity() && this.hasValidPrice();
  }

  /**
   * Obtiene información resumida del item
   * @returns Objeto con información resumida del item
   */
  getSummary(): {
    id: string;
    itemType: ItemType;
    itemId: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  } {
    return {
      id: this.id,
      itemType: this.itemType,
      itemId: this.getItemId(),
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      subtotal: this.getSubtotal(),
    };
  }
}
