import { apiClient } from "@api/client";
import { ApiOrder, CreateOrderRequest, OrderStats } from "@api/types";

export const ordersService = {
  create: async (data: CreateOrderRequest): Promise<ApiOrder> => {
    const response = await apiClient.post<ApiOrder>("/orders", data);
    return response.data;
  },

  getAll: async (status?: string): Promise<ApiOrder[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get<ApiOrder[]>("/orders", { params });
    return response.data;
  },

  getById: async (orderId: string): Promise<ApiOrder> => {
    const response = await apiClient.get<ApiOrder>(`/orders/${orderId}`);
    return response.data;
  },

  updateStatus: async (orderId: string, status: string): Promise<ApiOrder> => {
    const response = await apiClient.put<ApiOrder>(
      `/orders/${orderId}/status`,
      { status },
    );
    return response.data;
  },

  cancel: async (orderId: string): Promise<ApiOrder> => {
    const response = await apiClient.put<ApiOrder>(`/orders/${orderId}/cancel`);
    return response.data;
  },

  getStats: async (): Promise<OrderStats> => {
    const response = await apiClient.get<OrderStats>("/orders/stats");
    return response.data;
  },
};
