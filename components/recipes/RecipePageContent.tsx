"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { H2, Excerpt, Body, Caption } from "@/components/ui/Typography";
import { AddToHarvestButton } from "@/components/cart/AddToHarvestButton";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { brand } from "@/lib/brand";
import { getRecipeImageUrl, urlFor, type Recipe } from "@/lib/sanity";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";

interface RecipePageContentProps {
  recipe: Recipe;
  products: ShopifyProduct[];
}

export function RecipePageContent({ recipe, products }: RecipePageContentProps) {
  const { addItems } = useCart();
  const heroUrl = recipe.heroImage ? urlFor(recipe.heroImage) : getRecipeImageUrl(0);

  const productMap = new Map(products.map((p) => [p.handle, p]));

  const handleAddAll = async () => {
    const items = recipe.ingredients
      .map((ing) => {
        const product = productMap.get(ing.productHandle);
        const variant = product?.variants[0];
        return variant ? { variantId: variant.id, quantity: 1 } : null;
      })
      .filter(Boolean) as { variantId: string; quantity: number }[];

    if (items.length > 0) await addItems(items);
  };

  return (
    <>
      <section className="relative min-h-[70vh] w-full overflow-hidden">
        <Image
          src={heroUrl}
          alt={recipe.title}
          fill
          priority
          sizes="100vw"
          className="object-cover img-editorial"
        />
        <div className="absolute inset-0 bg-[var(--color-overlay)]" />
        <div className="absolute inset-0 flex items-end">
          <Container className="relative z-10 pb-16 pt-[var(--nav-height)] sm:pb-24">
            <Caption className="mb-4 block text-[var(--color-accent)]">{brand.recipesTitle}</Caption>
            <h1 className="max-w-3xl font-serif text-[var(--text-h1)] font-normal leading-tight tracking-[0.02em] text-[var(--color-on-image)]">
              {recipe.title}
            </h1>
            <Excerpt italic className="mt-6 max-w-xl text-[var(--color-on-image)]/90">
              {recipe.description}
            </Excerpt>
          </Container>
        </div>
      </section>

      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            <ScrollReveal>
              <H2 className="mb-10 text-center sm:mb-14">Ingredients</H2>
              <ul className="space-y-8">
                {recipe.ingredients.map((ing) => {
                  const product = productMap.get(ing.productHandle);
                  const variant = product?.variants[0];

                  return (
                    <li
                      key={ing.productHandle}
                      className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-8 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/product/${ing.productHandle}`}
                          className="font-serif text-lg text-[var(--color-text)] transition-opacity hover:opacity-80"
                        >
                          {product?.title ?? ing.productHandle}
                        </Link>
                        {ing.origin && (
                          <p className="mt-1 text-[10px] tracking-[0.18em] uppercase text-[var(--color-olive)]">
                            {ing.origin}
                          </p>
                        )}
                        <p className="mt-2 text-sm text-[var(--color-muted)]">{ing.quantity}</p>
                      </div>
                      {variant && (
                        <AddToHarvestButton
                          variantId={variant.id}
                          variant="secondary"
                          openDrawer={false}
                          compact
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      <Section dark>
        <Container>
          <ScrollReveal className="mx-auto max-w-2xl">
            <H2 className="mb-10 text-center sm:mb-14">The Ritual</H2>
            <ol className="space-y-12">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-6 sm:gap-8">
                  <span className="shrink-0 font-serif text-2xl text-[var(--color-accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Body className="text-base leading-[1.9] sm:text-lg">{step}</Body>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </Container>
      </Section>

      <Section>
        <Container wide>
          <ScrollReveal className="mb-10 sm:mb-14">
            <H2 className="text-center">{brand.recipesUsedIn}</H2>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {recipe.relatedProductHandles.map((handle, i) => {
              const product = productMap.get(handle);
              if (!product) return null;
              const variant = product.variants[0];

              return (
                <ScrollReveal key={handle} delay={i * 0.08}>
                  <div className="flex flex-col">
                    <Link href={`/product/${handle}`} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        {product.featuredImage && (
                          <Image
                            src={product.featuredImage.url}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover img-editorial transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        )}
                      </div>
                      <h3 className="mt-5 font-serif text-lg tracking-[0.02em] transition-opacity group-hover:opacity-80">
                        {product.title}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--color-muted)]">
                        {formatPrice(product.priceRange.minVariantPrice)}
                      </p>
                    </Link>
                    {variant && (
                      <div className="mt-4">
                        <AddToHarvestButton variantId={variant.id} variant="secondary" compact />
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section dark>
        <Container>
          <ScrollReveal className="mx-auto max-w-lg text-center">
            <H2 className="mb-6">{brand.recipesFooterCta}</H2>
            <Excerpt className="mb-10">
              Add every ingredient from this recipe to your harvest selection in one gesture.
            </Excerpt>
            <Button variant="primary" onClick={handleAddAll}>
              {brand.recipesAddAll}
            </Button>
          </ScrollReveal>
        </Container>
      </Section>
    </>
  );
}
