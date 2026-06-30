"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { Price } from "@/components/ui/Typography";

interface ProductGridProps {
  products: ShopifyProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-[var(--space-2xl)] lg:grid-cols-3">
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
            <h3 className="mt-6 font-serif text-lg font-normal tracking-[0.02em] text-[var(--color-text)] transition-colors duration-500 group-hover:text-[var(--color-text)]/70 sm:mt-8 sm:text-xl">
              {product.title}
            </h3>
            <Price className="mt-2 block sm:mt-3">
              {formatPrice(product.priceRange.minVariantPrice)}
            </Price>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  );
}
