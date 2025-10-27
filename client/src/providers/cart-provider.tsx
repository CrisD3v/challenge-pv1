"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { OptimisticCartState } from "@/lib/optimistic-state";
import {
  useAddToCart,
  useClearCart,
  useCreateCart,
  useUpdateCartQuantity,
} from "@/lib/queries/cart";
import { toast } from "@/utils/use-toast";
import { Toaster } from "sonner";

import type { CartItem, Item } from "@/lib/types";
import { CartContextType } from "@/lib/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [isUsingMockCart, setIsUsingMockCart] = useState(false);
  const optimisticState = useRef<OptimisticCartState>(
    new OptimisticCartState(),
  );

  // Estados derivados del estado optimista
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const createCartMutation = useCreateCart();
  const addToCartMutation = useAddToCart();
  const updateQuantityMutation = useUpdateCartQuantity();
  const clearCartMutation = useClearCart();

  // Función para actualizar estados derivados
  const updateDerivedStates = () => {
    const items = optimisticState.current.getItems();
    setCart(items);
    setTotalItems(optimisticState.current.getTotalItems());
    setTotalPrice(optimisticState.current.getTotalPrice());
  };

  // Initialize cart on mount
  useEffect(() => {
    const initCart = async () => {
      console.log("CartProvider: Initializing cart...");

      try {
        console.log("CartProvider: Attempting API connection...");
        const apiCart = await createCartMutation.mutateAsync();
        setCartId(apiCart.id);
        setIsUsingMockCart(false);

        // Inicializar estado optimista vacío (se llenará con addToCart)
        optimisticState.current = new OptimisticCartState([]);
        updateDerivedStates();

        console.log(
          "CartProvider: API cart initialized successfully",
          apiCart.id,
        );
      } catch (error) {
        console.warn("CartProvider: ❌ API connection failed, using mock cart");
        console.warn("Error details:", (error as any)?.message || error);

        // Fallback a mock cart
        const { mockCartStorage } = await import("@/lib/mock-cart");
        setCartId(mockCartStorage.getCartId());
        setIsUsingMockCart(true);

        // Inicializar estado optimista vacío para mock
        optimisticState.current = new OptimisticCartState([]);
        updateDerivedStates();

        console.log("CartProvider:  Mock cart initialized successfully");
      }
    };

    if (!cartId) {
      initCart();
    }
  }, [cartId, createCartMutation]);

  const addToCart = async (item: Item) => {
    if (item.stock === 0) {
      toast.error(`${item.name} is out of stock!`);
      return;
    }

    console.log("CartProvider: Adding item optimistically", item.name, item);

    // Verificar si ya está en el límite de stock
    const currentItems = optimisticState.current.getItems();
    const existingItem = currentItems.find(
      (cartItem) => cartItem.item.id === item.id,
    );

    if (existingItem && existingItem.quantity >= item.stock) {
      toast.error(
        `Cannot add more ${item.name} - only ${item.stock} in stock!`,
      );
      return;
    }

    // 1. Actualización optimista INMEDIATA
    const itemsBefore = optimisticState.current.getTotalItems();
    optimisticState.current.addItem(item);
    updateDerivedStates();
    const itemsAfter = optimisticState.current.getTotalItems();

    // 2. Mostrar toast apropiado
    if (itemsAfter > itemsBefore) {
      toast.success(`${item.name} added to cart!`);
    } else {
      toast.error(`Cannot add more ${item.name} - stock limit reached!`);
      return; // No continuar con la sincronización si no se agregó
    }

    // 3. Sincronización en background
    const syncOperation = async () => {
      try {
        if (isUsingMockCart || !cartId) {
          // Sincronizar con mock storage
          const { mockCartStorage } = await import("@/lib/mock-cart");
          mockCartStorage.addItem(item);
          // console.log('CartProvider: Synced with mock storage')
        } else {
          // Sincronizar con API (solo para persistencia, mantener estado optimista)
          const cartItem = {
            itemType:
              item.type === "product"
                ? ("PRODUCT" as const)
                : ("EVENT" as const),
            ...(item.type === "product"
              ? { productId: item.id }
              : { eventId: item.id }),
            quantity: 1,
          };

          const updatedCart = await addToCartMutation.mutateAsync({
            cartId,
            item: cartItem,
          });
          console.log("CartProvider: API response:", updatedCart);

          // NO sincronizar con API response porque el estado optimista ya tiene los datos correctos
          // Solo confirmar que la operación fue exitosa
          updateDerivedStates();

          console.log("CartProvider: Synced with API");
        }
      } catch (error) {
        console.warn("API sync failed, switching to mock mode:", error);
        // En caso de error, cambiar a modo mock
        setIsUsingMockCart(true);

        // Sincronizar con mock storage como fallback
        try {
          const { mockCartStorage } = await import("@/lib/mock-cart");
          mockCartStorage.addItem(item);
          console.log("CartProvider: Fallback to mock storage successful");
        } catch (mockError) {
          console.error("Mock storage fallback failed:", mockError);
        }
      }
    };

    // Ejecutar sincronización en background
    optimisticState.current.setPendingOperation(
      "add-" + item.id,
      syncOperation(),
    );
    syncOperation();
  };

  const removeFromCart = async (itemId: string) => {
    console.log("CartProvider: Removing item optimistically", itemId);

    // 1. Actualización optimista INMEDIATA
    optimisticState.current.updateQuantity(itemId, 0);
    updateDerivedStates();

    // 2. Sincronización en background
    const syncOperation = async () => {
      try {
        if (isUsingMockCart) {
          const { mockCartStorage } = await import("@/lib/mock-cart");
          mockCartStorage.removeItem(itemId);
        } else if (cartId) {
          await updateQuantityMutation.mutateAsync({
            cartId,
            itemId,
            quantity: 0,
          });
        }
      } catch (error) {
        // console.warn('Remove sync failed:', error)
      }
    };

    optimisticState.current.setPendingOperation(
      "remove-" + itemId,
      syncOperation(),
    );
    syncOperation();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    // console.log('CartProvider: Updating quantity optimistically', itemId, quantity)

    // 1. Actualización optimista INMEDIATA
    optimisticState.current.updateQuantity(itemId, quantity);
    updateDerivedStates();

    // 2. Sincronización en background
    const syncOperation = async () => {
      try {
        if (isUsingMockCart) {
          const { mockCartStorage } = await import("@/lib/mock-cart");
          mockCartStorage.updateQuantity(itemId, quantity);
        } else if (cartId) {
          const updatedCart = await updateQuantityMutation.mutateAsync({
            cartId,
            itemId,
            quantity,
          });
          console.log(
            "CartProvider: Update quantity API response:",
            updatedCart,
          );

          // NO sincronizar con API response, mantener estado optimista
          // console.log('CartProvider: Update quantity API sync successful, keeping optimistic state')
        }
      } catch (error) {
        // console.warn('Update quantity sync failed:', error)
      }
    };

    optimisticState.current.setPendingOperation(
      "update-" + itemId,
      syncOperation(),
    );
    syncOperation();
  };

  const clearCart = async () => {
    console.log("CartProvider: Clearing cart optimistically");

    // 1. Actualización optimista INMEDIATA
    optimisticState.current.clear();
    updateDerivedStates();

    // 2. Mostrar toast inmediatamente
    toast.success("Cart cleared!");

    // 3. Sincronización en background
    const syncOperation = async () => {
      try {
        if (isUsingMockCart) {
          const { mockCartStorage } = await import("@/lib/mock-cart");
          mockCartStorage.clear();
        } else if (cartId) {
          await clearCartMutation.mutateAsync(cartId);
        }
      } catch (error) {
        // console.warn('Clear cart sync failed:', error)
      }
    };

    optimisticState.current.setPendingOperation("clear", syncOperation());
    syncOperation();
  };

  const getTotalItems = () => totalItems;
  const getTotalPrice = () => totalPrice;

  const isLoading = createCartMutation.isPending;
  const hasPendingOperations = optimisticState.current.hasPendingOperations();

  return (
    <CartContext.Provider
      value={{
        cartId,
        totalItems,
        totalPrice,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
        clearCart,
        isLoading,
        hasPendingOperations,
      }}
    >
      {children}
      <Toaster />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
