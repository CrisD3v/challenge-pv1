import type { Item } from "@/lib/types";

// Strategy Pattern para filtros
export interface FilterStrategy {
  filter(items: Item[]): Item[];
}

export class AllItemsFilter implements FilterStrategy {
  filter(items: Item[]): Item[] {
    return items;
  }
}

export class ProductFilter implements FilterStrategy {
  filter(items: Item[]): Item[] {
    return items.filter((item) => item.type === "product");
  }
}

export class EventFilter implements FilterStrategy {
  filter(items: Item[]): Item[] {
    return items.filter((item) => item.type === "event");
  }
}

export class FilterContext {
  private strategy: FilterStrategy;

  constructor(strategy: FilterStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: FilterStrategy) {
    this.strategy = strategy;
  }

  executeFilter(items: Item[]): Item[] {
    return this.strategy.filter(items);
  }
}

// Factory para crear estrategias
export class FilterStrategyFactory {
  static create(type: "all" | "product" | "event"): FilterStrategy {
    switch (type) {
      case "all":
        return new AllItemsFilter();
      case "product":
        return new ProductFilter();
      case "event":
        return new EventFilter();
      default:
        throw new Error(`Unknown filter type: ${type}`);
    }
  }
}
