import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageContent } from "@/components/product/ProductPageContent";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProduct, getProductsByHandles } from "@/lib/shopify";
import { getCollectionProducts } from "@/lib/shopify/collections";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/structured-data";
import { getProductStory, getRecipesForProduct } from "@/lib/sanity";

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product" };
  return createPageMetadata({
    title: product.title,
    description: product.description,
    path: `/product/${id}`,
    images: product.featuredImage ? [product.featuredImage.url] : undefined,
  });
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const [product, story, recipes] = await Promise.all([
    getProduct(id),
    getProductStory(id),
    getRecipesForProduct(id, 4),
  ]);

  if (!product) notFound();

  const relatedFromMetafields = product.relatedProductHandles?.length
    ? await getProductsByHandles(product.relatedProductHandles)
    : [];

  const relatedProducts =
    relatedFromMetafields.length > 0
      ? relatedFromMetafields
      : (
          await getCollectionProducts(product.collections?.[0] ?? "dates", 4)
        )
          .filter((p) => p.handle !== product.handle)
          .slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          productJsonLd(product),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: product.title, path: `/product/${product.handle}` },
          ]),
        ]}
      />
      <ProductPageContent
        product={product}
        story={story}
        relatedProducts={relatedProducts}
        recipes={recipes}
      />
      <Footer />
    </>
  );
}
