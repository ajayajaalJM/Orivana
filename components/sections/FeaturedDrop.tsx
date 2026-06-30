"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AddToHarvestButton } from "@/components/cart/AddToHarvestButton";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { H2, Excerpt, Caption, Price } from "@/components/ui/Typography";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { brand } from "@/lib/brand";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";

interface FeaturedDropProps {
  product: ShopifyProduct;
  editorialDescription: string;
}

export function FeaturedDrop({ product, editorialDescription }: FeaturedDropProps) {
  const variant = product.variants[0];

  return (
    <Section id="featured-harvest">
      <Container wide>
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-[var(--space-3xl)]">
          <ScrollReveal>
            <div className="group relative lg:-ml-8">
              <ImageBlock
                src={product.featuredImage?.url ?? ""}
                alt={product.title}
                aspectRatio="tall"
                priority
                hoverZoom
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-col gap-6 sm:gap-10 lg:py-[var(--space-xl)] lg:pl-[var(--space-lg)]">
              <Caption>{brand.featuredHarvestLabel}</Caption>
              <H2>{brand.featuredHarvestTitle}</H2>
              <Excerpt italic className="max-w-sm">
                {editorialDescription}
              </Excerpt>
              <Price>{formatPrice(product.priceRange.minVariantPrice)}</Price>
              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:gap-6 sm:pt-[var(--space-md)]">
                <Link href={`/product/${product.handle}`} className="w-full sm:w-auto">
                  <Button variant="primary" fullWidthMobile>
                    {brand.featuredHarvestDiscover}
                  </Button>
                </Link>
                {variant && (
                  <AddToHarvestButton
                    variantId={variant.id}
                    variant="secondary"
                    fullWidthMobile
                  />
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </Section>
  );
}
