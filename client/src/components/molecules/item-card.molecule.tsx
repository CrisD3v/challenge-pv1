"use client";

import { motion } from "motion/react";
import { Card, Badge, Button } from "@components/atoms";
import { Calendar, Clock, MapPin, Package, ShoppingCart } from "lucide-react";
import { ItemCardProps } from "@/lib/types";
import { useCart } from "@/providers/cart-provider";

export const ItemCard = ({ item }: ItemCardProps) => {
  const { addToCart, isLoading, cart } = useCart();
  const isOutOfStock = item.stock === 0;

  // Verificar cuántos de este item ya están en el carrito
  const itemInCart = cart.find((cartItem) => cartItem.item.id === item.id);
  const quantityInCart = itemInCart?.quantity || 0;
  const canAddMore = quantityInCart < item.stock;
  const isAtStockLimit = quantityInCart >= item.stock && item.stock > 0;

  // Función para agregar el item al carrito
  const handleAddToCart = async () => {
    await addToCart(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <motion.img
            src={item.thumbnail}
            alt={item.name}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
            {item.type === "product" ? "Product" : "Event"}
          </Badge>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-balance leading-tight">
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {item.description}
            </p>
          </div>

          {item.type === "event" && (
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                <span>{item.duration}</span>
              </div>
            </div>
          )}

          {item.type === "product" && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              <span>
                {item.stock} in stock
                {quantityInCart > 0 && (
                  <span className="ml-1 text-blue-600">
                    ({quantityInCart} in cart)
                  </span>
                )}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isLoading || isAtStockLimit}
              size="sm"
              className={`gap-2 transition-all duration-200 ${
                isAtStockLimit ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              {isOutOfStock
                ? "Out of Stock"
                : isAtStockLimit
                  ? "Stock Limit Reached"
                  : "Add to Cart"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
