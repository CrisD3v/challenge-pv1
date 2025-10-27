"use client";

import { AnimatePresence, motion } from "motion/react";
import { ScrollArea } from "@ui/scroll-area";
import { Button } from "@components/atoms/index";
import { Loader2, ShoppingBag, X } from "lucide-react";
import { CartSidebarProps } from "@/lib/types";
import { useCart as useCartData } from "@/lib/queries/cart";
import { useCart } from "@/providers/cart-provider";
import Image from "next/image";

export const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const {
    cartId,
    getTotalItems,
    getTotalPrice,
    clearCart,
    cart,
    hasPendingOperations,
  } = useCart(); // Providing cart data

  const { data: cartData } = useCartData(cartId || undefined); // Fetching cart data

  const totalItems = getTotalItems(); // Total de items en el carrito
  const totalPrice = getTotalPrice(); // Total de precio en el carrito

  // Usar siempre cart del provider (estado optimista)
  const cartItems = cart;
  // Detectar modo offline: si no hay cartId o si cartId es mock
  const isMockMode = !cartId || cartId.startsWith("mock-cart-");

  // Manejar el checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      // Normalizar items para el sistema de órdenes
      const normalizedItems = cartItems.map((cartItem: any) => {
        const item = cartItem.item || cartItem.product || cartItem.event;
        return {
          item: item || {
            id: cartItem.productId || cartItem.eventId || "unknown",
            name: "Unknown Item",
            price: cartItem.unitPrice || 0,
            type: cartItem.itemType?.toLowerCase() || "product",
            thumbnail: "",
            stock: 1,
            description: "",
            category: "",
            brand: "",
            date: "",
            location: "",
            duration: "",
          },
          quantity: cartItem.quantity,
        };
      });

      // Limpiar carrito después de crear la orden
      clearCart();

      // Cerrar sidebar
      onClose();
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          >
            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5" />
                  <div>
                    <h2 className="text-xl font-semibold">Shopping Cart</h2>
                    {isMockMode && totalItems > 0 && (
                      <p className="text-xs text-yellow-600">
                        Using offline mode
                      </p>
                    )}
                    {hasPendingOperations && (
                      <p className="text-xs text-blue-600 flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Syncing...
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <ScrollArea className="flex-1 px-6">
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full py-12 text-center"
                  >
                    <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add some items to get started
                    </p>
                  </motion.div>
                ) : (
                  <div className="py-4">
                    <AnimatePresence mode="popLayout">
                      {cartItems.map((cartItem: any, index) => {
                        // cartItem siempre tiene la estructura { item: Item, quantity: number }
                        const item = cartItem.item;
                        const quantity = cartItem.quantity;
                        const unitPrice = item?.price || 0;
                        const itemId = `${item?.id}-${index}`;

                        return (
                          <motion.div
                            key={itemId}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="flex gap-4 py-4 border-b border-border last:border-0"
                          >
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                              <Image
                                width={100}
                                height={100}
                                src={item?.thumbnail || "/placeholder.svg"}
                                alt={item?.name || "Item"}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-semibold text-sm leading-tight">
                                    {item?.name || "Unknown Item"}
                                  </h4>
                                  <p className="text-xs text-muted-foreground capitalize">
                                    {item?.type || "item"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="w-8 text-center text-sm font-medium">
                                  Qty: {quantity}
                                </span>
                                <div className="text-right">
                                  <div className="text-sm font-semibold">
                                    ${(unitPrice * quantity).toFixed(2)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    ${unitPrice.toFixed(2)} each
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </ScrollArea>

              {/* Footer */}
              {cartItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-border p-6 space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Items</span>
                      <span className="font-medium">{totalItems}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total Price</span>
                      <span>${(totalPrice || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={cartItems.length === 0}
                    >
                      Checkout
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
