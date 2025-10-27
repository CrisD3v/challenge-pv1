"use client";
import { useState, useMemo } from "react";
import { Header } from "@components/organisms/header.organism";
import { CartSidebar } from "@components/organisms/cart-sidebar.organism";
import { ShopLayoutProps } from "@/lib/types";
import { ItemsGrid } from "@components/organisms/items-grid.organism";

import {
  FilterContext,
  FilterStrategyFactory,
} from "@patterns/filter-strategy";
import { useAllItems } from "@queries/products";
import { FilterTabs } from "../molecules/filter-tab.molecule";

export const ShopLayout = ({ children }: ShopLayoutProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado inicial del carrito de compras
  const [filter, setFilter] = useState<"all" | "product" | "event">("all"); // Estado inicial del filtro
  const [search, setSearch] = useState(""); // Estado inicial de la búsqueda

  const { data: allItems = [], isLoading } = useAllItems(search); // Obtiene todos los elementos por búsqueda

  // Usar Strategy Pattern para filtros
  const filteredItems = useMemo(() => {
    const strategy = FilterStrategyFactory.create(filter);
    const filterContext = new FilterContext(strategy);
    return filterContext.executeFilter(allItems);
  }, [allItems, filter]);

  return (
    <div className="min-h-screen bg-background">
      <Header onCartOpen={() => setIsCartOpen(true)} />
      <main className="container mx-auto px-4 py-8">
        <FilterTabs
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
        />

        <ItemsGrid items={filteredItems} isLoading={isLoading} />
      </main>
      {children}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};
