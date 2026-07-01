"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { brand } from "@/lib/brand";
import { getCheckoutLabel, getCartLabel } from "@/lib/membership";
import { useMembership } from "@/hooks/useMembership";
import { QuantitySelector } from "@/components/shop/QuantitySelector";
import { PriceDisplay } from "@/components/shop/PriceDisplay";

export function HarvestDrawer() {
  const { cart, isOpen, closeDrawer, updateQuantity, removeLine, checkout, isLoading, error, clearError } =
    useCart();
  const { cartMode, tier } = useMembership();

  const drawerTitle = getCartLabel(cartMode);
  const checkoutLabel =
    cartMode === "trade-quote"
      ? brand.requestInvoice
      : cartMode === "chef-supply"
        ? brand.completeSupplyOrder
        : cart.checkoutUrl
          ? getCheckoutLabel(cartMode)
          : brand.checkoutUnavailable;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeDrawer]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[70] bg-[var(--color-text)]/25 backdrop-blur-[2px]"
            onClick={closeDrawer}
            aria-hidden
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={drawerTitle}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col border-l border-[var(--color-border)] bg-[var(--color-bg)] shadow-[-8px_0_32px_var(--color-shadow)] safe-top safe-bottom"
          >
            <div className="flex items-start justify-between border-b border-[var(--color-border)] px-6 py-5">
              <div>
                <h2 className="font-serif text-xl tracking-[0.04em] text-[var(--color-text)]">
                  {drawerTitle}
                </h2>
                {tier && tier !== "individual" && (
                  <p className="mt-1 text-[10px] tracking-[0.15em] uppercase text-[var(--color-olive)]">
                    {tier === "restaurant"
                      ? "Restaurant pricing applied"
                      : "Wholesale pricing applied"}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="text-xs tracking-[0.2em] uppercase text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cart.lines.length === 0 ? (
                <p className="py-12 text-center text-sm font-light leading-relaxed text-[var(--color-muted)]">
                  {brand.harvestSelectionEmpty}
                </p>
              ) : (
                <ul className="space-y-8">
                  {cart.lines.map((line) => (
                    <li key={line.id} className="flex gap-4">
                      <Link
                        href={`/product/${line.merchandise.productHandle}`}
                        onClick={closeDrawer}
                        className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-alt)]"
                      >
                        {line.merchandise.imageUrl && (
                          <Image
                            src={line.merchandise.imageUrl}
                            alt={line.merchandise.productTitle}
                            fill
                            sizes="64px"
                            className="object-cover img-editorial"
                          />
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/product/${line.merchandise.productHandle}`}
                          onClick={closeDrawer}
                          className="block font-serif text-base leading-snug text-[var(--color-text)] transition-opacity hover:opacity-80"
                        >
                          {line.merchandise.productTitle}
                        </Link>
                        {line.merchandise.origin && (
                          <p className="mt-1 text-[10px] tracking-[0.18em] uppercase text-[var(--color-olive)]">
                            {line.merchandise.origin}
                          </p>
                        )}
                        <PriceDisplay money={line.merchandise.price} className="mt-2 text-sm text-[var(--color-muted)]" />

                        <div className="mt-3 flex items-center gap-4">
                          <QuantitySelector
                            quantity={line.quantity}
                            disabled={isLoading}
                            onDecrease={() => updateQuantity(line.id, line.quantity - 1)}
                            onIncrease={() => updateQuantity(line.id, line.quantity + 1)}
                          />
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => removeLine(line.id)}
                            className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.lines.length > 0 && (
              <div className="border-t border-[var(--color-border)] px-6 py-6">
                {error && (
                  <p className="mb-4 text-center text-xs text-[var(--color-accent)]" role="alert">
                    {error}
                    <button type="button" onClick={clearError} className="ml-2 underline">
                      Dismiss
                    </button>
                  </p>
                )}
                <div className="mb-6 flex items-baseline justify-between">
                  <span className="text-xs tracking-[0.2em] uppercase text-[var(--color-muted)]">
                    Subtotal
                  </span>
                  <PriceDisplay money={cart.cost.subtotalAmount} className="font-serif text-lg text-[var(--color-text)]" />
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={cartMode !== "trade-quote" && !cart.checkoutUrl && cart.lines.length > 0}
                  onClick={
                    cartMode === "trade-quote"
                      ? () => {
                          alert(
                            "Your trade allocation request has been submitted. Our team will send an invoice shortly."
                          );
                          closeDrawer();
                        }
                      : checkout
                  }
                >
                  {checkoutLabel}
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
