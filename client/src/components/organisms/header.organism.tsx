"use client";

import { motion } from "motion/react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold">CRIS SHOP</h1>
            <p className="text-sm text-muted-foreground">
              Welcome to our online store!
            </p>
          </motion.div>
        </div>
      </div>
    </header>
  );
};
