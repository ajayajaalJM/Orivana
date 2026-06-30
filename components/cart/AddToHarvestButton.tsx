"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { brand } from "@/lib/brand";

interface AddToHarvestButtonProps {
  variantId: string;
  quantity?: number;
  variant?: "primary" | "secondary" | "ghost";
  fullWidthMobile?: boolean;
  className?: string;
  openDrawer?: boolean;
  label?: string;
  compact?: boolean;
  disabled?: boolean;
}

export function AddToHarvestButton({
  variantId,
  quantity = 1,
  variant = "primary",
  fullWidthMobile = false,
  className = "",
  openDrawer = true,
  label,
  compact = false,
  disabled = false,
}: AddToHarvestButtonProps) {
  const { addItem, isLoading } = useCart();
  const [confirmed, setConfirmed] = useState(false);

  const handleClick = async () => {
    const success = await addItem(variantId, quantity, { openDrawer });
    if (success) {
      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 2000);
    }
  };

  const displayLabel = confirmed
    ? brand.addedToHarvest
    : label ?? brand.addToHarvest;

  if (compact) {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        disabled={isLoading || disabled}
        className={`text-[10px] tracking-[0.18em] uppercase text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)] disabled:opacity-40 ${className}`}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={displayLabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {displayLabel}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <Button
      variant={variant}
      fullWidthMobile={fullWidthMobile}
      className={className}
      onClick={handleClick}
      disabled={isLoading || disabled}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={displayLabel}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="inline-block"
        >
          {isLoading ? "Adding..." : displayLabel}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
