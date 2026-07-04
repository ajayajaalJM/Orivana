import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections/Footer";
import { CollectionHero } from "@/components/collections/CollectionHero";
import { CollectionStory } from "@/components/collections/CollectionStory";
import { CollectionProductSection } from "@/components/collections/CollectionProductSection";
import { CollectionFeaturedRecipe } from "@/components/collections/CollectionFeaturedRecipe";
import { CollectionJournalPreview } from "@/components/collections/CollectionJournalPreview";
import { createPageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/structured-data";
import { getCollectionProducts, resolveCollectionHandle } from "@/lib/shopify";
import { getCollectionEditorial, getRecipe, getJournalPosts } from "@/lib/sanity";

export const revalidate = 60;

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const resolved = resolveCollectionHandle(handle);
  const editorial = await getCollectionEditorial(resolved);
  return createPageMetadata({
    title: editorial?.title ?? "Collection",
    description: editorial?.heroIntro,
    path: `/collections/${resolved}`,
    images: editorial?.heroImage ? [editorial.heroImage] : undefined,
  });
}

export default async function CollectionDetailPage({ params }: Props) {
  const { handle } = await params;
  const resolved = resolveCollectionHandle(handle);
  const editorial = await getCollectionEditorial(resolved);

  if (!editorial) notFound();

  const [products, recipe, journalPosts] = await Promise.all([
    getCollectionProducts(resolved, 24),
    editorial.featuredRecipe
      ? Promise.resolve(editorial.featuredRecipe)
      : getRecipe(editorial.featuredRecipeSlug),
    editorial.journalPosts?.length
      ? Promise.resolve(editorial.journalPosts)
      : getJournalPosts(12).then((posts) =>
          posts.filter((post) => editorial.journalSlugs.includes(post.slug.current))
        ),
  ]);

  return (
    <>
      <JsonLd
        data={[
          itemListJsonLd(
            products.map((product) => ({
              name: product.title,
              url: absoluteUrl(`/product/${product.handle}`) ?? `/product/${product.handle}`,
            }))
          ),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
            { name: editorial.title, path: `/collections/${resolved}` },
          ]),
        ]}
      />
      <CollectionHero editorial={editorial} />
      <CollectionStory editorial={editorial} />
      <CollectionProductSection products={products} collectionTitle={editorial.shortTitle} />
      <CollectionFeaturedRecipe recipe={recipe} />
      <CollectionJournalPreview posts={journalPosts.slice(0, 3)} />
      <Footer />
    </>
  );
}
