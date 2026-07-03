import type { Metadata } from "next";
import { CollectionsLanding } from "@/components/collections/CollectionsLanding";
import { Footer } from "@/components/sections/Footer";
import { brand } from "@/lib/brand";
import { createPageMetadata } from "@/lib/metadata";
import { getCollectionShowcaseItems } from "@/lib/shopify";

export const metadata: Metadata = createPageMetadata({
  title: brand.collectionsLandingTitle,
  description: brand.collectionsLandingDescription,
  path: "/collections",
});

export default async function CollectionsPage() {
  const collections = await getCollectionShowcaseItems();

  return (
    <>
      <CollectionsLanding collections={collections} />
      <Footer />
    </>
  );
}
