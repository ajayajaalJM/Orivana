import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections/Footer";
import { CollectionHero } from "@/components/collections/CollectionHero";
import { CollectionStory } from "@/components/collections/CollectionStory";
import { CollectionProductSection } from "@/components/collections/CollectionProductSection";
import { CollectionFeaturedRecipe } from "@/components/collections/CollectionFeaturedRecipe";
import { CollectionJournalPreview } from "@/components/collections/CollectionJournalPreview";
import { getCollectionEditorial } from "@/lib/collections";
import { createPageMetadata } from "@/lib/metadata";
import { getCollectionProducts, resolveCollectionHandle } from "@/lib/shopify";
import { getRecipe, getJournalPosts } from "@/lib/sanity";

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const resolved = resolveCollectionHandle(handle);
  const editorial = getCollectionEditorial(resolved);
  return createPageMetadata({
    title: editorial?.title ?? "Collection",
    description: editorial?.heroIntro,
    path: `/collections/${resolved}`,
  });
}

export default async function CollectionDetailPage({ params }: Props) {
  const { handle } = await params;
  const resolved = resolveCollectionHandle(handle);
  const editorial = getCollectionEditorial(resolved);

  if (!editorial) notFound();

  const [products, recipe, allJournal] = await Promise.all([
    getCollectionProducts(resolved, 24),
    getRecipe(editorial.featuredRecipeSlug),
    getJournalPosts(12),
  ]);

  const journalPosts = allJournal.filter((post) =>
    editorial.journalSlugs.includes(post.slug.current)
  );

  return (
    <>
      <CollectionHero editorial={editorial} />
      <CollectionStory editorial={editorial} />
      <CollectionProductSection products={products} />
      <CollectionFeaturedRecipe recipe={recipe} />
      <CollectionJournalPreview posts={journalPosts.slice(0, 3)} />
      <Footer />
    </>
  );
}
