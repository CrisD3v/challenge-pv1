import type { CartItem, Item } from "@/lib/types";

// Sistema de estado optimista para el carrito
export class OptimisticCartState {
  private items: CartItem[] = [];
  private pendingOperations: Map<string, Promise<any>> = new Map();

  constructor(initialItems: CartItem[] = []) {
    this.items = [...initialItems];
  }

  // Obtener estado actual
  getItems(): CartItem[] {
    return [...this.items];
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.items.reduce(
      (total, item) => total + item.item.price * item.quantity,
      0,
    );
  }

  // Agregar item optimísticamente con validación de stock
  addItem(item: Item): CartItem[] {
    const existingIndex = this.items.findIndex(
      (cartItem) => cartItem.item.id === item.id,
    );

    if (existingIndex >= 0) {
      // Verificar que no exceda el stock disponible
      const currentQuantity = this.items[existingIndex].quantity;
      if (currentQuantity < item.stock) {
        this.items[existingIndex].quantity += 1;
        console.log(
          `OptimisticCart: Increased quantity for ${item.name} to ${this.items[existingIndex].quantity}/${item.stock}`,
        );
      } else {
        console.warn(
          `OptimisticCart: Cannot add more ${item.name} - stock limit reached (${item.stock})`,
        );
        // No agregar más, ya está en el límite de stock
      }
    } else {
      // Verificar que hay stock disponible
      if (item.stock > 0) {
        this.items.push({ item, quantity: 1 });
        console.log(
          `OptimisticCart: Added new item ${item.name} (1/${item.stock})`,
        );
      } else {
        console.warn(`OptimisticCart: Cannot add ${item.name} - out of stock`);
      }
    }

    return this.getItems();
  }

  // Actualizar cantidad optimísticamente
  updateQuantity(itemId: string, quantity: number): CartItem[] {
    if (quantity <= 0) {
      this.items = this.items.filter((item) => item.item.id !== itemId);
    } else {
      const index = this.items.findIndex((item) => item.item.id === itemId);
      if (index >= 0) {
        this.items[index].quantity = quantity;
      }
    }

    return this.getItems();
  }

  // Limpiar carrito optimísticamente
  clear(): CartItem[] {
    this.items = [];
    return this.getItems();
  }

  // Sincronizar con estado real (cuando la API responde)
  sync(realItems: CartItem[]): CartItem[] {
    this.items = [...realItems];
    return this.getItems();
  }

  // Manejar operación pendiente
  setPendingOperation(key: string, promise: Promise<any>): void {
    this.pendingOperations.set(key, promise);

    // Limpiar cuando termine
    promise.finally(() => {
      this.pendingOperations.delete(key);
    });
  }

  // Verificar si hay operaciones pendientes
  hasPendingOperations(): boolean {
    return this.pendingOperations.size > 0;
  }
}

// Sistema de estado optimista para órdenes
export class OptimisticOrderState {
  private orders: any[] = [];

  constructor(initialOrders: any[] = []) {
    this.orders = [...initialOrders];
  }

  getOrders(): any[] {
    return [...this.orders];
  }

  // Crear orden optimísticamente
  createOrder(orderData: any): any {
    const optimisticOrder = {
      id: `temp-${Date.now()}`,
      ...orderData,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.unshift(optimisticOrder);
    return optimisticOrder;
  }

  // Sincronizar con orden real
  syncOrder(tempId: string, realOrder: any): void {
    const index = this.orders.findIndex((order) => order.id === tempId);
    if (index >= 0) {
      this.orders[index] = realOrder;
    }
  }

  // Actualizar estado de orden optimísticamente
  updateOrderStatus(orderId: string, status: string): any {
    const index = this.orders.findIndex((order) => order.id === orderId);
    if (index >= 0) {
      this.orders[index] = {
        ...this.orders[index],
        status,
        updatedAt: new Date().toISOString(),
      };
      return this.orders[index];
    }
    return null;
  }
}
