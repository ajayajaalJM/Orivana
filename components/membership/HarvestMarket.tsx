"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AddToHarvestButton } from "@/components/cart/AddToHarvestButton";
import { Caption, H3 } from "@/components/ui/Typography";
import { useMembership } from "@/hooks/useMembership";
import { brand } from "@/lib/brand";
import {
  filterProductsForTier,
  formatTierPrice,
  getBulkPacks,
  getLockedProducts,
  getProductVisibility,
} from "@/lib/membership";
import {
  getProductShortLabel,
  isComingSoonProduct,
  isProductPurchasable,
} from "@/lib/product-availability";
import type { ShopifyProduct } from "@/lib/shopify";

interface HarvestMarketProps {
  products: ShopifyProduct[];
}

export function HarvestMarket({ products }: HarvestMarketProps) {
  const { tier } = useMembership();
  const accessible = filterProductsForTier(products, tier);
  const locked = getLockedProducts(products, tier);

  return (
    <div>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {accessible.map((product) => (
          <ProductCard key={product.id} product={product} tier={tier} locked={false} />
        ))}
        {locked.map((product) => (
          <ProductCard key={product.id} product={product} tier={tier} locked />
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  tier,
  locked,
}: {
  product: ShopifyProduct;
  tier: ReturnType<typeof useMembership>["tier"];
  locked: boolean;
}) {
  const variant = product.variants[0];
  const visibility = getProductVisibility(product);
  const bulkPacks = getBulkPacks(product);
  const comingSoon = isComingSoonProduct(product);

  return (
    <article className={`card-surface border border-[var(--color-border)] ${locked || comingSoon ? "opacity-75" : ""}`}>
      <Link href={locked ? "/membership" : `/product/${product.handle}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden">
          {product.featuredImage && (
            <Image
              src={product.featuredImage.url}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`object-cover img-editorial transition-transform duration-700 ${
                locked || comingSoon ? "saturate-[0.65]" : "group-hover:scale-[1.03]"
              }`}
            />
          )}
          {comingSoon && (
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[var(--color-bg)]/80 via-transparent to-transparent p-5">
              <Caption className="tracking-[0.22em]">{brand.comingSoon}</Caption>
            </div>
          )}
          {locked && !comingSoon && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)]/60">
              <Caption className="text-center px-4">
                {visibility === "trade" ? brand.tradeOnlyProduct : brand.lockedProduct}
              </Caption>
            </div>
          )}
        </div>
        <div className="p-5 sm:p-6">
          {!comingSoon && product.origin && (
            <Caption className="mb-2 block text-[var(--color-olive)]">{product.origin}</Caption>
          )}
          <H3 className="!text-lg sm:!text-xl">
            {comingSoon ? getProductShortLabel(product) : product.title}
          </H3>
          {!locked && !comingSoon && (
            <p className="mt-2 font-serif text-lg text-[var(--color-accent)]">
              {formatTierPrice(product, tier)}
              {tier && tier !== "individual" && (
                <span className="ml-2 text-xs font-sans font-light tracking-wide text-[var(--color-muted)]">
                  {tier === "restaurant" ? "restaurant" : "wholesale"}
                </span>
              )}
            </p>
          )}
        </div>
      </Link>

      {!locked && !comingSoon && variant && isProductPurchasable(product) && (
        <div className="border-t border-[var(--color-border)] px-5 pb-5 sm:px-6 sm:pb-6">
          {bulkPacks.length > 0 && tier && tier !== "individual" && (
            <BulkPackSelector bulkPacks={bulkPacks} variantId={variant.id} />
          )}
          {(!bulkPacks.length || !tier || tier === "individual") && (
            <AddToHarvestButton variantId={variant.id} variant="secondary" compact className="mt-4" />
          )}
        </div>
      )}
    </article>
  );
}

function BulkPackSelector({
  bulkPacks,
  variantId,
}: {
  bulkPacks: ReturnType<typeof getBulkPacks>;
  variantId: string;
}) {
  const [selected, setSelected] = useState(0);
  const pack = bulkPacks[selected];

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        {bulkPacks.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setSelected(i)}
            className={`min-h-[36px] px-3 py-1.5 text-[10px] tracking-[0.12em] uppercase transition-colors ${
              selected === i
                ? "border-b border-[var(--color-accent)] text-[var(--color-olive)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <AddToHarvestButton
        variantId={variantId}
        variant="secondary"
        compact
        label={`Add ${pack.label}`}
        quantity={pack.quantity}
      />
    </div>
  );
}
