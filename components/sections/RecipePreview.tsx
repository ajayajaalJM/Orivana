"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { H2, Excerpt, Caption } from "@/components/ui/Typography";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { TextLink } from "@/components/ui/TextLink";
import { brand } from "@/lib/brand";
import { getRecipeImageUrl, urlFor, type Recipe } from "@/lib/sanity";

interface RecipePreviewProps {
  recipes: Recipe[];
}

export function RecipePreview({ recipes }: RecipePreviewProps) {
  const [featured, ...rest] = recipes;

  return (
    <Section>
      <Container wide>
        <ScrollReveal className="mb-10 sm:mb-[var(--space-2xl)]">
          <Caption className="mb-4 block">{brand.recipesTitle}</Caption>
          <H2>{brand.recipesSubtitle}</H2>
        </ScrollReveal>

        {featured && (
          <ScrollReveal className="mb-10 sm:mb-[var(--space-2xl)]">
            <Link
              href={`/recipes/${featured.slug.current}`}
              className="group grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-[var(--space-2xl)]"
            >
              <ImageBlock
                src={
                  featured.heroImage ? urlFor(featured.heroImage) : getRecipeImageUrl(0)
                }
                alt={featured.title}
                aspectRatio="landscape"
                hoverZoom
              />
              <div className="flex flex-col justify-center gap-5 sm:gap-8 lg:py-[var(--space-xl)]">
                <H2 className="group-hover:text-[var(--color-text)]/80 transition-colors duration-500">
                  {featured.title}
                </H2>
                <Excerpt italic className="max-w-md">
                  {featured.description}
                </Excerpt>
                <span className="text-sm font-light tracking-wide text-[var(--color-muted)] transition-colors duration-500 group-hover:text-[var(--color-text)]">
                  Read recipe →
                </span>
              </div>
            </Link>
          </ScrollReveal>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-1 gap-12 sm:gap-[var(--space-2xl)] md:grid-cols-2">
            {rest.map((recipe, i) => (
              <ScrollReveal key={recipe._id} delay={i * 0.1}>
                <Link href={`/recipes/${recipe.slug.current}`} className="group block">
                  <ImageBlock
                    src={recipe.heroImage ? urlFor(recipe.heroImage) : getRecipeImageUrl(i + 1)}
                    alt={recipe.title}
                    aspectRatio="landscape"
                    hoverZoom
                  />
                  <h3 className="mt-6 font-serif text-xl transition-colors group-hover:text-[var(--color-text)]/80">
                    {recipe.title}
                  </h3>
                  <Excerpt className="mt-3">{recipe.description}</Excerpt>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal className="mt-[var(--space-2xl)]">
          <TextLink href="/recipes">{brand.recipesViewAll} →</TextLink>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
