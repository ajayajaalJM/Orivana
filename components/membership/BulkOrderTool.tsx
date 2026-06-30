"use client";

import { useState } from "react";
import { AddToHarvestButton } from "@/components/cart/AddToHarvestButton";
import { Caption, H3 } from "@/components/ui/Typography";
import { useMembership } from "@/hooks/useMembership";
import { brand } from "@/lib/brand";
import { formatTierPrice, getBulkPacks } from "@/lib/membership";
import type { ShopifyProduct } from "@/lib/shopify";

interface BulkOrderToolProps {
  products: ShopifyProduct[];
}

export function BulkOrderTool({ products }: BulkOrderToolProps) {
  const { tier, isB2B } = useMembership();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!isB2B) return null;

  const bulkProducts = products.filter((p) => getBulkPacks(p).length > 0);

  const setQty = (handle: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [handle]: Math.max(0, qty) }));
  };

  return (
    <div className="space-y-8">
      {bulkProducts.map((product) => {
        const variant = product.variants[0];
        const packs = getBulkPacks(product);
        const qty = quantities[product.handle] ?? 0;

        return (
          <article
            key={product.id}
            className="card-surface flex flex-col gap-4 border border-[var(--color-border)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          >
            <div className="min-w-0">
              {product.origin && (
                <Caption className="mb-1 block text-[var(--color-olive)]">{product.origin}</Caption>
              )}
              <H3 className="!text-lg">{product.title}</H3>
              <p className="mt-1 font-serif text-base text-[var(--color-accent)]">
                {formatTierPrice(product, tier)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {packs.map((pack) => (
                  <span
                    key={pack.label}
                    className="text-[10px] tracking-[0.12em] uppercase text-[var(--color-muted)]"
                  >
                    {pack.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQty(product.handle, qty - 1)}
                  className="flex h-8 w-8 items-center justify-center border border-[var(--color-border)] text-[var(--color-muted)]"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(product.handle, qty + 1)}
                  className="flex h-8 w-8 items-center justify-center border border-[var(--color-border)] text-[var(--color-muted)]"
                >
                  +
                </button>
              </div>
              {variant && qty > 0 && (
                <AddToHarvestButton
                  variantId={variant.id}
                  quantity={qty}
                  variant="secondary"
                  compact
                  label={tier === "wholesale" ? brand.requestQuotation : brand.addToHarvest}
                />
              )}
            </div>
          </article>
        );
      })}

      {bulkProducts.length === 0 && (
        <p className="py-8 text-center font-serif text-lg text-[var(--color-muted)]">
          No bulk products available for your tier.
        </p>
      )}
    </div>
  );
}
