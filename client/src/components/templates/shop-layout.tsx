"use client";
import { useState } from "react";
import { Header } from "@components/organisms/header.organism";
import { CartSidebar } from "@components/organisms/cart-sidebar.organism";
import { ShopLayoutProps } from "@/lib/types";

export const ShopLayout = ({ children }: ShopLayoutProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado inicial del carrito de compras
  return (
    <div className="min-h-screen bg-background">
      <Header onCartOpen={() => setIsCartOpen(true)} />
      {children}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};
