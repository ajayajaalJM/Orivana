import type { Metadata } from "next";
import { CollectionsLanding } from "@/components/collections/CollectionsLanding";
import { Footer } from "@/components/sections/Footer";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: brand.collectionsLandingTitle,
  description: brand.collectionsLandingDescription,
};

export default function CollectionsPage() {
  return (
    <>
      <CollectionsLanding />
      <Footer />
    </>
  );
}
