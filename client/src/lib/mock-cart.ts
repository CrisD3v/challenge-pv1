import type { CartItem, Item } from "@/lib/types";

// Mock cart storage para fallback
class MockCartStorage {
  private cart: CartItem[] = [];
  private cartId = "mock-cart-" + Date.now();

  getCartId() {
    return this.cartId;
  }

  getCart(): CartItem[] {
    return [...this.cart]; // Return copy to avoid mutations
  }

  addItem(item: Item): CartItem[] {
    console.log(
      "MockCart: Adding item",
      item.name,
      item.id,
      "Stock:",
      item.stock,
    );
    const existingIndex = this.cart.findIndex(
      (cartItem) => cartItem.item.id === item.id,
    );

    if (existingIndex >= 0) {
      // Verificar stock antes de incrementar
      const currentQuantity = this.cart[existingIndex].quantity;
      if (currentQuantity < item.stock) {
        this.cart[existingIndex].quantity += 1;
        console.log(
          "MockCart: Updated quantity for",
          item.name,
          "to",
          this.cart[existingIndex].quantity,
          "/",
          item.stock,
        );
      } else {
        console.warn(
          "MockCart: Cannot add more",
          item.name,
          "- stock limit reached:",
          item.stock,
        );
      }
    } else {
      // Verificar stock antes de añadir
      if (item.stock > 0) {
        this.cart.push({ item, quantity: 1 });
        console.log(
          "MockCart: Added new item",
          item.name,
          "(1/",
          item.stock,
          ")",
        );
      } else {
        console.warn("MockCart: Cannot add", item.name, "- out of stock");
      }
    }

    console.log(
      "MockCart: Current cart",
      this.cart.map((c) => ({
        name: c.item.name,
        qty: c.quantity,
        stock: c.item.stock,
      })),
    );
    return [...this.cart];
  }

  updateQuantity(itemId: string, quantity: number): CartItem[] {
    console.log("MockCart: Updating quantity for", itemId, "to", quantity);
    if (quantity <= 0) {
      this.cart = this.cart.filter((cartItem) => cartItem.item.id !== itemId);
    } else {
      const index = this.cart.findIndex(
        (cartItem) => cartItem.item.id === itemId,
      );
      if (index >= 0) {
        // Verificar stock antes de actualizar
        const maxQuantity = Math.min(quantity, this.cart[index].item.stock);
        this.cart[index].quantity = maxQuantity;

        if (maxQuantity < quantity) {
          console.warn(
            "MockCart: Quantity limited by stock for",
            this.cart[index].item.name,
            "- max:",
            this.cart[index].item.stock,
          );
        }
      }
    }
    return [...this.cart];
  }

  removeItem(itemId: string): CartItem[] {
    console.log("MockCart: Removing item", itemId);
    this.cart = this.cart.filter((cartItem) => cartItem.item.id !== itemId);
    return [...this.cart];
  }

  clear(): CartItem[] {
    console.log("MockCart: Clearing cart");
    this.cart = [];
    return [...this.cart];
  }

  getTotalItems(): number {
    const total = this.cart.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0,
    );
    console.log("MockCart: Total items", total);
    return total;
  }

  getTotalPrice(): number {
    const total = this.cart.reduce(
      (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
      0,
    );
    console.log("MockCart: Total price", total);
    return total;
  }
}

export const mockCartStorage = new MockCartStorage();
