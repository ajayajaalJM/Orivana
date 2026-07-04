import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedDrop } from "@/components/sections/FeaturedDrop";
import { BrandStory } from "@/components/sections/BrandStory";
import { CollectionGrid } from "@/components/sections/CollectionGrid";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { RecipePreview } from "@/components/sections/RecipePreview";
import { MembershipCTA } from "@/components/sections/MembershipCTA";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomepage, getJournalPosts, getRecipes, getHeroBackgroundUrl, getBrandStoryImageUrl, urlFor } from "@/lib/sanity";
import { getCollectionShowcaseItems, getFeaturedProduct } from "@/lib/shopify";
import { getFeaturedProductHandle } from "@/lib/shopify/config";
import { createPageMetadata } from "@/lib/metadata";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { siteSeo } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  const heroBackgroundUrl = homepage.hero.backgroundImage
    ? urlFor(homepage.hero.backgroundImage)
    : getHeroBackgroundUrl();

  return createPageMetadata({
    title: siteSeo.title,
    description: homepage.hero.subtitle || siteSeo.description,
    path: "/",
    images: [heroBackgroundUrl],
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const homepage = await getHomepage();
  const featuredHandle =
    homepage.featuredDrop.productHandle?.trim() || getFeaturedProductHandle();
  const featuredProduct = await getFeaturedProduct(featuredHandle);

  const [collections, journalPosts, recipes] = await Promise.all([
    getCollectionShowcaseItems(),
    getJournalPosts(3),
    getRecipes(3),
  ]);

  const heroBackgroundUrl = homepage.hero.backgroundImage
    ? urlFor(homepage.hero.backgroundImage)
    : getHeroBackgroundUrl();
  const brandStoryImageUrl = homepage.brandStory.image
    ? urlFor(homepage.brandStory.image)
    : getBrandStoryImageUrl();

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <HeroSection
        title={homepage.hero.title}
        subtitle={homepage.hero.subtitle}
        ctaText={homepage.hero.ctaText}
        backgroundVideoUrl={homepage.hero.backgroundVideoUrl}
        backgroundImageUrl={heroBackgroundUrl}
      />
      {featuredProduct && (
        <FeaturedDrop
          product={featuredProduct}
          editorialDescription={homepage.featuredDrop.editorialDescription}
        />
      )}
      <BrandStory
        title={homepage.brandStory.title}
        body={homepage.brandStory.body}
        ctaText={homepage.brandStory.ctaText}
        imageUrl={brandStoryImageUrl}
      />
      <CollectionGrid collections={collections} />
      <RecipePreview recipes={recipes} />
      <JournalPreview posts={journalPosts} />
      <MembershipCTA />
      <Footer />
    </>
  );
}
