"use client";

import { motion } from "motion/react";
import { LoadingSpinner } from "@/components/atoms/loading-spinner.atom";
import { ItemCard } from "@components/molecules/item-card.molecule";
import { ItemsGridProps } from "@/lib/types";

export const ItemsGrid = ({ items, isLoading }: ItemsGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-muted-foreground">No items found</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ItemCard item={item} />
        </motion.div>
      ))}
    </motion.div>
  );
};
