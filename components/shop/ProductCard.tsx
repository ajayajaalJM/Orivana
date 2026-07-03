import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { PriceDisplay } from "@/components/shop/PriceDisplay";
import { Caption } from "@/components/ui/Typography";
import { brand } from "@/lib/brand";
import {
  getProductShortLabel,
  isComingSoonProduct,
} from "@/lib/product-availability";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
  index?: number;
  priority?: boolean;
}

export function ProductCard({ product, index = 0, priority }: ProductCardProps) {
  const comingSoon = isComingSoonProduct(product);

  return (
    <ScrollReveal delay={index * 0.06}>
      <Link href={`/product/${product.handle}`} className="group block">
        <div className="relative overflow-hidden">
          <ImageBlock
            src={product.featuredImage?.url ?? ""}
            alt={product.title}
            aspectRatio="portrait"
            hoverZoom={!comingSoon}
            priority={priority}
            className={comingSoon ? "opacity-80 saturate-[0.65]" : undefined}
          />
          {comingSoon && (
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[var(--color-bg)]/80 via-transparent to-transparent p-5 sm:p-6">
              <Caption className="tracking-[0.22em] text-[var(--color-text)]">
                {brand.comingSoon}
              </Caption>
            </div>
          )}
        </div>
        {comingSoon ? (
          <div className="mt-6 sm:mt-8">
            <h3 className="font-serif text-lg font-normal tracking-[0.02em] text-[var(--color-text)] sm:text-xl">
              {getProductShortLabel(product)}
            </h3>
          </div>
        ) : (
          <>
            <h3 className="mt-6 font-serif text-lg font-normal tracking-[0.02em] text-[var(--color-text)] transition-colors duration-500 group-hover:text-[var(--color-text)]/70 sm:mt-8 sm:text-xl">
              {product.title}
            </h3>
            <PriceDisplay money={product.priceRange.minVariantPrice} className="mt-2 block sm:mt-3" />
          </>
        )}
      </Link>
    </ScrollReveal>
  );
}
