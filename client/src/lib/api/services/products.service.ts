import { apiClient } from "@api/client";
import type { ApiProduct } from "@api/types";

export const productsService = {
  getAll: async (search?: string): Promise<ApiProduct[]> => {
    const params = search ? { search } : {};
    const response = await apiClient.get<ApiProduct[]>("/products", { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiProduct> => {
    const response = await apiClient.get<ApiProduct>(`/products/${id}`);
    return response.data;
  },

  create: async (
    data: Omit<ApiProduct, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiProduct> => {
    const response = await apiClient.post<ApiProduct>("/products", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<Omit<ApiProduct, "id" | "createdAt" | "updatedAt">>,
  ): Promise<ApiProduct> => {
    const response = await apiClient.put<ApiProduct>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
