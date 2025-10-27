// API Response Types
export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  unit: number;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEvent {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  unit: number;
  date: string;
  location: string;
  duration: number;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCartItem {
  id: string;
  itemType: "PRODUCT" | "EVENT";
  productId?: string;
  eventId?: string;
  quantity: number;
  unitPrice: number;
  product?: ApiProduct;
  event?: ApiEvent;
}

export interface ApiCart {
  id: string;
  items: ApiCartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCartItemRequest {
  itemType: "PRODUCT" | "EVENT";
  productId?: string;
  eventId?: string;
  quantity: number;
}

export interface CreateOrderRequest {
  items: Array<{
    itemType: "PRODUCT" | "EVENT";
    productId?: string;
    eventId?: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export interface ApiOrder {
  id: string;
  items: Array<{
    id: string;
    itemType: "PRODUCT" | "EVENT";
    productId?: string;
    eventId?: string;
    quantity: number;
    unitPrice: number;
    product?: any;
    event?: any;
  }>;
  total: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
}

// Transform functions
export const transformApiProduct = (apiProduct: ApiProduct) => ({
  id: apiProduct.id,
  name: apiProduct.name,
  description: apiProduct.description,
  price: apiProduct.unitPrice,
  stock: apiProduct.unit,
  thumbnail: apiProduct.thumbnail,
  type: "product" as const,
  category: "General",
  brand: "Unknown",
  date: apiProduct.createdAt,
  location: "",
  duration: "",
});

export const transformApiEvent = (apiEvent: ApiEvent) => ({
  id: apiEvent.id,
  name: apiEvent.name,
  description: apiEvent.description,
  price: apiEvent.unitPrice,
  stock: apiEvent.unit,
  thumbnail: apiEvent.thumbnail,
  type: "event" as const,
  category: "Events",
  brand: "Event Organizer",
  date: apiEvent.date,
  location: apiEvent.location,
  duration: `${apiEvent.duration} min`,
});
