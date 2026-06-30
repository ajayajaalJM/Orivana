import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShopContent } from "@/components/shop/ShopContent";
import { Footer } from "@/components/sections/Footer";
import { brand } from "@/lib/brand";
import { getProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: brand.exploreCollection,
  description: brand.shopDescription,
};

export default async function ShopPage() {
  const products = await getProducts(24);

  return (
    <>
      <Section className="page-top">
        <Container wide>
          <PageHeader title={brand.exploreCollection} description={brand.shopDescription} />
          <ShopContent products={products} />
        </Container>
      </Section>
      <Footer />
    </>
  );
}
