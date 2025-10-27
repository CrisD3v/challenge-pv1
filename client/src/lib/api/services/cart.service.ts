import { apiClient } from "@api/client";
import type { ApiCart, CreateCartItemRequest } from "@api/types";

export const cartService = {
  create: async (): Promise<ApiCart> => {
    const response = await apiClient.post<ApiCart>("/cart");
    return response.data;
  },

  getById: async (cartId: string): Promise<ApiCart> => {
    const response = await apiClient.get<ApiCart>(`/cart/${cartId}`);
    return response.data;
  },

  addItem: async (
    cartId: string,
    item: CreateCartItemRequest,
  ): Promise<ApiCart> => {
    const response = await apiClient.post<ApiCart>(
      `/cart/${cartId}/items`,
      item,
    );
    return response.data;
  },

  addOrIncrementItem: async (
    cartId: string,
    item: CreateCartItemRequest,
  ): Promise<ApiCart> => {
    const response = await apiClient.post<ApiCart>(
      `/cart/${cartId}/items/add-or-increment`,
      item,
    );
    return response.data;
  },

  updateQuantity: async (
    cartId: string,
    itemId: string,
    quantity: number,
  ): Promise<ApiCart> => {
    const response = await apiClient.put<ApiCart>(
      `/cart/${cartId}/items/${itemId}/quantity`,
      { quantity },
    );
    return response.data;
  },

  decrementItem: async (cartId: string, itemId: string): Promise<ApiCart> => {
    const response = await apiClient.put<ApiCart>(
      `/cart/${cartId}/items/${itemId}/decrement`,
    );
    return response.data;
  },

  clearCart: async (cartId: string): Promise<ApiCart> => {
    const response = await apiClient.delete<ApiCart>(`/cart/${cartId}/items`);
    return response.data;
  },
};
