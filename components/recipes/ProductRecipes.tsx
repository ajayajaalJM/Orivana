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

interface ProductRecipesProps {
  recipes: Recipe[];
  productHandle: string;
}

export function ProductRecipes({ recipes }: ProductRecipesProps) {
  if (recipes.length === 0) return null;

  return (
    <Section dark>
      <Container wide>
        <ScrollReveal className="mb-10 sm:mb-[var(--space-2xl)]">
          <Caption className="mb-4 block">{brand.recipesTitle}</Caption>
          <H2>{brand.recipesProductHeading}</H2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-[var(--space-2xl)]">
          {recipes.map((recipe, i) => {
            const imageUrl = recipe.heroImage
              ? urlFor(recipe.heroImage)
              : getRecipeImageUrl(i);

            return (
              <ScrollReveal key={recipe._id} delay={i * 0.1}>
                <Link href={`/recipes/${recipe.slug.current}`} className="group block">
                  <ImageBlock src={imageUrl} alt={recipe.title} aspectRatio="landscape" hoverZoom />
                  <h3 className="mt-6 font-serif text-xl font-normal tracking-[0.02em] transition-colors duration-500 group-hover:text-[var(--color-text)]/80 sm:text-2xl">
                    {recipe.title}
                  </h3>
                  <Excerpt className="mt-3 max-w-md">{recipe.description}</Excerpt>
                  <span className="mt-4 inline-block text-xs tracking-wide text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-text)]">
                    Read recipe →
                  </span>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal className="mt-[var(--space-2xl)]">
          <TextLink href="/recipes">{brand.recipesViewAll} →</TextLink>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
