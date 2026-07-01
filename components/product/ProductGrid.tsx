"use client";

import { ProductCard } from "@/components/shop/ProductCard";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductGridProps {
  products: ShopifyProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <p className="py-16 text-center text-sm font-light text-[var(--color-muted)]">
        No selections available at this time.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-[var(--space-2xl)] lg:grid-cols-3">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
