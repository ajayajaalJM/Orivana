import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipePageContent } from "@/components/recipes/RecipePageContent";
import { Footer } from "@/components/sections/Footer";
import { getRecipe } from "@/lib/sanity";
import { createPageMetadata } from "@/lib/metadata";
import { getProducts } from "@/lib/shopify";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) return { title: "Recipe" };
  return createPageMetadata({
    title: recipe.title,
    description: recipe.description,
    path: `/recipes/${slug}`,
  });
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) notFound();

  const handles = [
    ...new Set([
      ...recipe.ingredients.map((i) => i.productHandle),
      ...recipe.relatedProductHandles,
    ]),
  ];

  const allProducts = await getProducts(20);
  const products = allProducts.filter((p) => handles.includes(p.handle));

  return (
    <>
      <RecipePageContent recipe={recipe} products={products} />
      <Footer />
    </>
  );
}
