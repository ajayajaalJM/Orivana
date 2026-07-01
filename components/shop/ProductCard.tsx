import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { PriceDisplay } from "@/components/shop/PriceDisplay";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
  index?: number;
  priority?: boolean;
}

export function ProductCard({ product, index = 0, priority }: ProductCardProps) {
  return (
    <ScrollReveal delay={index * 0.06}>
      <Link href={`/product/${product.handle}`} className="group block">
        <div className="relative overflow-hidden">
          <ImageBlock
            src={product.featuredImage?.url ?? ""}
            alt={product.title}
            aspectRatio="portrait"
            hoverZoom
            priority={priority}
          />
        </div>
        <h3 className="mt-6 font-serif text-lg font-normal tracking-[0.02em] text-[var(--color-text)] transition-colors duration-500 group-hover:text-[var(--color-text)]/70 sm:mt-8 sm:text-xl">
          {product.title}
        </h3>
        <PriceDisplay money={product.priceRange.minVariantPrice} className="mt-2 block sm:mt-3" />
      </Link>
    </ScrollReveal>
  );
}
