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
