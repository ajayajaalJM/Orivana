import type { Metadata } from "next";
import { CollectionsLanding } from "@/components/collections/CollectionsLanding";
import { Footer } from "@/components/sections/Footer";
import { brand } from "@/lib/brand";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: brand.collectionsLandingTitle,
  description: brand.collectionsLandingDescription,
  path: "/collections",
});

export default function CollectionsPage() {
  return (
    <>
      <CollectionsLanding />
      <Footer />
    </>
  );
}
