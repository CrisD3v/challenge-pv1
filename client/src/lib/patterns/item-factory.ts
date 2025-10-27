import type { Event, Item, Product } from "@/lib/types";

// Factory Pattern para crear items
export class ItemFactory {
  static createProduct(data: Omit<Product, "type">): Product {
    return {
      ...data,
      type: "product",
    };
  }

  static createEvent(data: Omit<Event, "type">): Event {
    return {
      ...data,
      type: "event",
    };
  }

  static createItem(type: "product" | "event", data: any): Item {
    switch (type) {
      case "product":
        return this.createProduct(data);
      case "event":
        return this.createEvent(data);
      default:
        throw new Error(`Unknown item type: ${type}`);
    }
  }
}
