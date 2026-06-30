import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Excerpt, H2, Caption } from "@/components/ui/Typography";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { brand } from "@/lib/brand";
import { getRecipeImageUrl, urlFor, type Recipe } from "@/lib/sanity";

interface CollectionFeaturedRecipeProps {
  recipe: Recipe | null;
}

export function CollectionFeaturedRecipe({ recipe }: CollectionFeaturedRecipeProps) {
  if (!recipe) return null;

  const imageUrl = recipe.heroImage ? urlFor(recipe.heroImage) : getRecipeImageUrl(0);

  return (
    <Section>
      <Container wide>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-[var(--space-3xl)]">
          <ImageBlock src={imageUrl} alt={recipe.title} aspectRatio="landscape" />
          <div className="lg:pl-[var(--space-lg)]">
            <Caption className="mb-4 block">{brand.culinaryJournal}</Caption>
            <H2 className="mb-6">{recipe.title}</H2>
            <Excerpt italic className="mb-8">
              {recipe.description}
            </Excerpt>
            <Link
              href={`/recipes/${recipe.slug.current}`}
              className="text-xs tracking-[0.2em] uppercase text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              Read Recipe →
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
