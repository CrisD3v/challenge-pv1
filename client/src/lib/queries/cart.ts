import { cartService } from "@api/services/cart.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateCartItemRequest } from "@/lib/api/types";

export const useCart = (cartId?: string) => {
  return useQuery({
    queryKey: ["cart", cartId],
    queryFn: () => cartService.getById(cartId!),
    enabled: !!cartId,
  });
};

export const useCreateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.create,
    onSuccess: (data) => {
      queryClient.setQueryData(["cart", data.id], data);
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartId,
      item,
    }: {
      cartId: string;
      item: CreateCartItemRequest;
    }) => cartService.addOrIncrementItem(cartId, item),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart", data.id], data);
    },
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartId,
      itemId,
      quantity,
    }: {
      cartId: string;
      itemId: string;
      quantity: number;
    }) => cartService.updateQuantity(cartId, itemId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart", data.id], data);
    },
  });
};

export const useDecrementCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, itemId }: { cartId: string; itemId: string }) =>
      cartService.decrementItem(cartId, itemId),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart", data.id], data);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: string) => cartService.clearCart(cartId),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart", data.id], data);
    },
  });
};
