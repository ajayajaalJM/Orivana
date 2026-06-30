import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedDrop } from "@/components/sections/FeaturedDrop";
import { BrandStory } from "@/components/sections/BrandStory";
import { CollectionGrid } from "@/components/sections/CollectionGrid";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { RecipePreview } from "@/components/sections/RecipePreview";
import { MembershipCTA } from "@/components/sections/MembershipCTA";
import { Footer } from "@/components/sections/Footer";
import { getHomepage, getJournalPosts, getRecipes } from "@/lib/sanity";
import { getFeaturedProduct, getCollections } from "@/lib/shopify";

export default async function HomePage() {
  const [homepage, featuredProduct, collections, journalPosts, recipes] = await Promise.all([
    getHomepage(),
    getFeaturedProduct(),
    getCollections(6),
    getJournalPosts(3),
    getRecipes(3),
  ]);

  return (
    <>
      <HeroSection
        title={homepage.hero.title}
        subtitle={homepage.hero.subtitle}
        ctaText={homepage.hero.ctaText}
        backgroundVideoUrl={homepage.hero.backgroundVideoUrl}
      />
      <FeaturedDrop
        product={featuredProduct}
        editorialDescription={homepage.featuredDrop.editorialDescription}
      />
      <BrandStory
        title={homepage.brandStory.title}
        body={homepage.brandStory.body}
        ctaText={homepage.brandStory.ctaText}
      />
      <CollectionGrid collections={collections} />
      <RecipePreview recipes={recipes} />
      <JournalPreview posts={journalPosts} />
      <MembershipCTA />
      <Footer />
    </>
  );
}
