"use client";

import { toast } from "@/utils/use-toast";
import { OptimisticOrderState } from "@/lib/optimistic-state";
import { useCreateOrder, useUpdateOrderStatus } from "@/lib/queries/orders";
import type { CartItem } from "@/lib/types";
import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { OrdersContextType } from "@/lib/types";

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<any[]>([]);
  const optimisticState = useRef<OptimisticOrderState>(
    new OptimisticOrderState(),
  );

  const createOrderMutation = useCreateOrder();
  const updateOrderStatusMutation = useUpdateOrderStatus();

  const updateDerivedStates = () => {
    setOrders(optimisticState.current.getOrders());
  };

  const createOrder = async (cartItems: CartItem[]): Promise<string> => {
    console.log("OrdersProvider: Creating order optimistically");

    // 1. Crear orden optimísticamente
    const orderData = {
      items: cartItems.map((cartItem) => ({
        itemType:
          cartItem.item.type === "product"
            ? ("PRODUCT" as const)
            : ("EVENT" as const),
        ...(cartItem.item.type === "product"
          ? { productId: cartItem.item.id }
          : { eventId: cartItem.item.id }),
        quantity: cartItem.quantity,
        unitPrice: cartItem.item.price,
      })),
      total: cartItems.reduce(
        (sum, item) => sum + item.item.price * item.quantity,
        0,
      ),
    };

    const optimisticOrder = optimisticState.current.createOrder(orderData);
    updateDerivedStates();

    // 2. Mostrar toast inmediatamente
    toast.success(
      "Order created successfully!",
      "Your order has been placed and is being processed",
    );

    // 3. Sincronización en background
    try {
      const realOrder = await createOrderMutation.mutateAsync({
        items: orderData.items,
      });

      // Sincronizar con orden real
      optimisticState.current.syncOrder(optimisticOrder.id, realOrder);
      updateDerivedStates();

      console.log("OrdersProvider: Order synced with API", realOrder.id);
      return realOrder.id;
    } catch (error) {
      console.warn("Order creation failed, keeping optimistic state:", error);
      // En caso de error, mantener el estado optimista
      toast.info(
        "Order saved locally",
        "Your order will sync automatically when connection is restored",
      );
      return optimisticOrder.id;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    console.log(
      "OrdersProvider: Updating order status optimistically",
      orderId,
      status,
    );

    // 1. Actualización optimista INMEDIATA
    optimisticState.current.updateOrderStatus(orderId, status);
    updateDerivedStates();

    // 2. Mostrar toast inmediatamente
    toast.success(
      `Order ${status.toLowerCase()}!`,
      `Your order status has been updated to ${status.toLowerCase()}`,
    );

    // 3. Sincronización en background
    try {
      await updateOrderStatusMutation.mutateAsync({ orderId, status });
      console.log("OrdersProvider: Order status synced with API");
    } catch (error) {
      console.warn("Order status update failed:", error);
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        isCreatingOrder: createOrderMutation.isPending,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
