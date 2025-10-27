import { apiClient } from "@api/client";
import type { ApiEvent } from "@api/types";

export const eventsService = {
  getAll: async (search?: string): Promise<ApiEvent[]> => {
    const params = search ? { search } : {};
    const response = await apiClient.get<ApiEvent[]>("/events", { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiEvent> => {
    const response = await apiClient.get<ApiEvent>(`/events/${id}`);
    return response.data;
  },

  create: async (
    data: Omit<ApiEvent, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiEvent> => {
    const response = await apiClient.post<ApiEvent>("/events", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<Omit<ApiEvent, "id" | "createdAt" | "updatedAt">>,
  ): Promise<ApiEvent> => {
    const response = await apiClient.put<ApiEvent>(`/events/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`);
  },
};
