import { ordersService } from "@api/services/orders.service";
import type { CreateOrderRequest } from "@api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useOrders = (status?: string) => {
  return useQuery({
    queryKey: ["orders", status],
    queryFn: () => ordersService.getAll(status),
  });
};

export const useOrder = (orderId?: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersService.getById(orderId!),
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersService.create(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["order", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      ordersService.updateStatus(orderId, status),
    onSuccess: (data) => {
      queryClient.setQueryData(["order", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersService.cancel(orderId),
    onSuccess: (data) => {
      queryClient.setQueryData(["order", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ["order-stats"],
    queryFn: ordersService.getStats,
  });
};
