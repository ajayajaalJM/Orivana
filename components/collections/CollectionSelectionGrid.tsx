"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { Caption } from "@/components/ui/Typography";
import { brand } from "@/lib/brand";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";

interface CollectionSelectionGridProps {
  products: ShopifyProduct[];
}

export function CollectionSelectionGrid({ products }: CollectionSelectionGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-20 text-center font-serif text-xl text-[var(--color-muted)]">
        No selections match your refinement.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 sm:gap-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-[var(--space-2xl)]">
      {products.map((product, i) => (
        <ScrollReveal key={product.id} delay={i * 0.06}>
          <Link href={`/product/${product.handle}`} className="group block">
            <div className="relative overflow-hidden">
              <ImageBlock
                src={product.featuredImage?.url ?? ""}
                alt={product.title}
                aspectRatio="portrait"
                hoverZoom
              />
            </div>
            <div className="mt-6 space-y-2 sm:mt-8">
              <h3 className="font-serif text-xl font-normal tracking-[0.02em] text-[var(--color-text)] transition-colors duration-500 group-hover:text-[var(--color-text)]/75 sm:text-2xl">
                {product.title}
              </h3>
              {product.origin && (
                <Caption className="block text-[var(--color-olive)]">{product.origin}</Caption>
              )}
              <p className="font-serif text-lg text-[var(--color-accent)]">
                From {formatPrice(product.priceRange.minVariantPrice)}
              </p>
              <span className="inline-block pt-2 text-[10px] tracking-[0.2em] uppercase text-[var(--color-muted)] transition-colors duration-500 group-hover:text-[var(--color-text)]">
                {brand.discoverSelection}
              </span>
            </div>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  );
}
