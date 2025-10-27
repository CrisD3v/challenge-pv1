"use client";

import { motion } from "motion/react";
import { Button, Input } from "@components/atoms";
import { Search } from "lucide-react";
import { FilterTabsProps } from "@/lib/types";

export function FilterTabs({
  filter,
  search,
  onFilterChange,
  onSearchChange,
}: FilterTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-4 mb-8"
    >
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search products and events..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => onFilterChange("all")}
        >
          All Items
        </Button>
        <Button
          variant={filter === "product" ? "default" : "outline"}
          onClick={() => onFilterChange("product")}
        >
          Products
        </Button>
        <Button
          variant={filter === "event" ? "default" : "outline"}
          onClick={() => onFilterChange("event")}
        >
          Events
        </Button>
      </div>
    </motion.div>
  );
}
