"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AddToHarvestButton } from "@/components/cart/AddToHarvestButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { H1, H2, Excerpt, Price, Caption } from "@/components/ui/Typography";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { ProductRecipes } from "@/components/recipes/ProductRecipes";
import { useMembership } from "@/hooks/useMembership";
import { VariantSelector } from "@/components/shop/VariantSelector";
import { ProductCard } from "@/components/shop/ProductCard";
import { formatTierPrice, getBulkPacks, getProductVisibility, canAccessProduct } from "@/lib/membership";
import { type ShopifyProduct, type ShopifyVariant } from "@/lib/shopify";
import { brand } from "@/lib/brand";
import type { ProductStory, Recipe } from "@/lib/sanity";

interface ProductPageContentProps {
  product: ShopifyProduct;
  story: ProductStory | null;
  relatedProducts: ShopifyProduct[];
  recipes: Recipe[];
}

export function ProductPageContent({
  product,
  story,
  relatedProducts,
  recipes,
}: ProductPageContentProps) {
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant>(
    product.variants[0]
  );
  const [activeImage, setActiveImage] = useState(0);
  const { tier, isB2B, chefSupplyMode } = useMembership();

  const visibility = getProductVisibility(product);
  const isLocked = !canAccessProduct(tier, visibility);
  const bulkPacks = getBulkPacks(product);
  const variantIndex = product.variants.findIndex((v) => v.id === selectedVariant?.id);
  const displayPrice = formatTierPrice(product, tier, Math.max(0, variantIndex));

  const images = product.images.length
    ? product.images
    : product.featuredImage
      ? [product.featuredImage]
      : [];

  return (
    <>
      <Section className="page-top">
        <Container wide>
          <div className="grid grid-cols-1 gap-10 sm:gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-[var(--space-3xl)]">
            <div className="space-y-4 sm:space-y-6">
              <div className="group relative">
                <ImageBlock
                  src={images[activeImage]?.url ?? ""}
                  alt={product.title}
                  aspectRatio="tall"
                  priority
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative h-14 w-14 shrink-0 overflow-hidden transition-opacity duration-500 sm:h-16 sm:w-16 ${
                        activeImage === i ? "opacity-100" : "opacity-40"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover img-editorial"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <ScrollReveal>
              <div className="flex flex-col gap-6 sm:gap-10 lg:py-[var(--space-xl)] lg:pl-[var(--space-lg)]">
                <H1 className="page-title">{product.title}</H1>
                {product.origin && (
                  <Caption className="text-[var(--color-olive)]">{product.origin}</Caption>
                )}
                <Price className="text-base">
                  {displayPrice}
                  {tier && tier !== "individual" && (
                    <span className="ml-2 text-xs font-sans font-light tracking-wide text-[var(--color-muted)]">
                      {tier === "restaurant" ? "restaurant price" : "wholesale price"}
                    </span>
                  )}
                </Price>
                {tier === "individual" && isB2B === false && (
                  <p className="text-xs tracking-wide text-[var(--color-muted)]">
                    Retail price ·{" "}
                    <Link href="/membership" className="text-[var(--color-sea)] hover:underline">
                      Join Inner Circle
                    </Link>{" "}
                    for exclusive harvests
                  </p>
                )}
                <Excerpt className="max-w-sm">{product.description}</Excerpt>

                {isLocked && (
                  <div className="card-surface border border-[var(--color-border)] p-5">
                    <Caption className="mb-4 block">
                      {visibility === "trade" ? brand.tradeOnlyProduct : brand.lockedProduct}
                    </Caption>
                    <Link href="/membership">
                      <Button variant="secondary">Apply for Access</Button>
                    </Link>
                  </div>
                )}

                {!isLocked && (
                  <>
                    <VariantSelector
                      variants={product.variants}
                      selectedVariant={selectedVariant}
                      onSelect={setSelectedVariant}
                    />

                    {isB2B && bulkPacks.length > 0 && chefSupplyMode && (
                      <div className="space-y-3">
                        <Caption className="block">Bulk Supply Options</Caption>
                        <div className="flex flex-wrap gap-3">
                          {bulkPacks.map((pack) => (
                            <AddToHarvestButton
                              key={pack.label}
                              variantId={selectedVariant?.id ?? ""}
                              quantity={pack.quantity}
                              variant="secondary"
                              compact
                              label={pack.label}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 sm:pt-[var(--space-md)]">
                      {selectedVariant && (
                        <AddToHarvestButton
                          variantId={selectedVariant.id}
                          fullWidthMobile
                          className="w-full sm:w-auto"
                          disabled={!selectedVariant.availableForSale}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {story && (
        <Section dark>
          <Container>
            <ScrollReveal className="mx-auto max-w-2xl px-1">
              <H2 className="mb-8 sm:mb-12">{story.title}</H2>
              <Excerpt className="text-center">{story.body}</Excerpt>
            </ScrollReveal>
          </Container>
        </Section>
      )}

      {recipes.length > 0 && <ProductRecipes recipes={recipes} productHandle={product.handle} />}

      {relatedProducts.length > 0 && (
        <Section>
          <Container wide>
            <H2 className="mb-10 text-center sm:mb-[var(--space-2xl)]">From the Same Harvest</H2>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-[var(--space-2xl)] lg:mx-auto lg:max-w-4xl">
              {relatedProducts.slice(0, 3).map((related, i) => (
                <ProductCard key={related.id} product={related} index={i} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
