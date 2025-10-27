import { mockEvents, mockProducts } from "@/lib/mock-data";
import type { ApiEvent, ApiProduct } from "@api/types";

// Simular respuestas de API usando mock data
export const fallbackService = {
  products: {
    getAll: async (search?: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const apiProducts: ApiProduct[] = mockProducts.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        unitPrice: product.price,
        unit: product.stock,
        thumbnail: product.thumbnail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      if (search) {
        return apiProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase()),
        );
      }

      return apiProducts;
    },
  },

  events: {
    getAll: async (search?: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const apiEvents: ApiEvent[] = mockEvents.map((event) => ({
        id: event.id,
        name: event.name,
        description: event.description,
        unitPrice: event.price,
        unit: event.stock,
        date: event.date,
        location: event.location,
        duration: parseInt(event.duration.replace(" min", "")),
        thumbnail: event.thumbnail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      if (search) {
        return apiEvents.filter(
          (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.description.toLowerCase().includes(search.toLowerCase()) ||
            e.location.toLowerCase().includes(search.toLowerCase()),
        );
      }

      return apiEvents;
    },
  },
};
