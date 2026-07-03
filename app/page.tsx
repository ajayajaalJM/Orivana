import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedDrop } from "@/components/sections/FeaturedDrop";
import { BrandStory } from "@/components/sections/BrandStory";
import { CollectionGrid } from "@/components/sections/CollectionGrid";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { RecipePreview } from "@/components/sections/RecipePreview";
import { MembershipCTA } from "@/components/sections/MembershipCTA";
import { Footer } from "@/components/sections/Footer";
import { getHomepage, getJournalPosts, getRecipes, getHeroBackgroundUrl, getBrandStoryImageUrl, urlFor } from "@/lib/sanity";
import { getCollectionShowcaseItems, getFeaturedProduct } from "@/lib/shopify";
import { getFeaturedProductHandle } from "@/lib/shopify/config";

export const revalidate = 60;

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
