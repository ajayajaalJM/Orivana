import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { H2, Excerpt } from "@/components/ui/Typography";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { Footer } from "@/components/sections/Footer";
import { brand } from "@/lib/brand";
import { getRecipes, getRecipeImageUrl, urlFor } from "@/lib/sanity";

export const metadata: Metadata = {
  title: brand.recipesTitle,
  description: "Culinary editorial experiences from the Orivana atelier — recipes that begin with land and harvest.",
};

export default async function RecipesPage() {
  const recipes = await getRecipes(12);

  return (
    <>
      <Section className="page-top">
        <Container>
          <PageHeader
            title={brand.recipesTitle}
            description="Culinary stories woven from dates, olive oil, and raw honey — designed to bring the harvest into your kitchen."
          />

          <div className="grid grid-cols-1 gap-12 sm:gap-16 md:grid-cols-2">
            {recipes.map((recipe, i) => {
              const imageUrl = recipe.heroImage
                ? urlFor(recipe.heroImage)
                : getRecipeImageUrl(i);

              return (
                <Link
                  key={recipe._id}
                  href={`/recipes/${recipe.slug.current}`}
                  className="group block"
                >
                  <ImageBlock src={imageUrl} alt={recipe.title} aspectRatio="landscape" hoverZoom />
                  <div className="mt-6 space-y-3 sm:mt-8">
                    <H2 className="!text-xl sm:!text-2xl">{recipe.title}</H2>
                    <Excerpt italic>{recipe.description}</Excerpt>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
}
