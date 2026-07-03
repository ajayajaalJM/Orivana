"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { Caption } from "@/components/ui/Typography";
import { brand } from "@/lib/brand";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import {
  getProductShortLabel,
  getProductVariantLabels,
  isComingSoonProduct,
} from "@/lib/product-availability";

interface CollectionSelectionGridProps {
  products: ShopifyProduct[];
}

export function CollectionSelectionGrid({ products }: CollectionSelectionGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-24 text-center font-serif text-xl text-[var(--color-muted)]">
        No selections match your refinement.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
      {products.map((product, i) => {
        const comingSoon = isComingSoonProduct(product);
        const variantLabels = getProductVariantLabels(product);

        return (
          <ScrollReveal key={product.id} delay={i * 0.05}>
            <Link href={`/product/${product.handle}`} className="group block">
              <div className="relative overflow-hidden bg-[var(--color-surface)]">
                <div className="relative aspect-[4/5]">
                  <ImageBlock
                    src={product.featuredImage?.url ?? ""}
                    alt={product.title}
                    fill
                    hoverZoom={!comingSoon}
                    className={comingSoon ? "opacity-85 saturate-[0.7]" : undefined}
                  />
                  <div className="pointer-events-none absolute inset-0 border border-[var(--color-border)]/30 transition-colors duration-700 group-hover:border-[var(--color-accent)]/35" />
                  {comingSoon && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-bg)]/90 via-[var(--color-bg)]/20 to-transparent px-6 pb-6 pt-16">
                      <Caption className="tracking-[0.22em] text-[var(--color-text)]">
                        {brand.comingSoon}
                      </Caption>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-3 px-1 sm:mt-7">
                {product.productType && (
                  <Caption className="block text-[var(--color-olive)]">{product.productType}</Caption>
                )}
                <h3 className="font-serif text-xl font-normal leading-snug tracking-[0.02em] text-[var(--color-text)] transition-colors duration-500 group-hover:text-[var(--color-text)]/75 sm:text-2xl">
                  {comingSoon ? getProductShortLabel(product) : product.title}
                </h3>
                {!comingSoon && product.origin && (
                  <p className="text-sm font-light text-[var(--color-muted)]">{product.origin}</p>
                )}
                {variantLabels && (
                  <p className="text-[11px] tracking-[0.16em] uppercase text-[var(--color-muted)]">
                    {variantLabels}
                  </p>
                )}
                {!comingSoon && (
                  <p className="font-serif text-lg text-[var(--color-accent)]">
                    From {formatPrice(product.priceRange.minVariantPrice)}
                    {product.priceRange.maxVariantPrice.amount !==
                      product.priceRange.minVariantPrice.amount &&
                      ` – ${formatPrice(product.priceRange.maxVariantPrice)}`}
                  </p>
                )}
                <span className="inline-block pt-1 text-[10px] tracking-[0.2em] uppercase text-[var(--color-muted)] transition-colors duration-500 group-hover:text-[var(--color-text)]">
                  {comingSoon ? brand.comingSoon : brand.discoverSelection}
                </span>
              </div>
            </Link>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
