"use client";

import { motion } from "motion/react";
import { Button, Badge } from "@components/atoms";
import { ShoppingCart } from "lucide-react";
import { CartButtonProps } from "@/lib/types";

export const CartButton = ({ totalItems, onClick }: CartButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        variant="outline"
        size="lg"
        className="relative gap-2 bg-transparent"
        onClick={onClick}
      >
        <motion.div
          animate={totalItems > 0 ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ShoppingCart className="h-5 w-5" />
        </motion.div>
        <span className="hidden sm:inline">Cart</span>
        {totalItems > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute -top-2 -right-2"
          >
            <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
              <motion.span
                key={totalItems}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {totalItems}
              </motion.span>
            </Badge>
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
};
