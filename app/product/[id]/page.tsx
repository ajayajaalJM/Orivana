import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageContent } from "@/components/product/ProductPageContent";
import { Footer } from "@/components/sections/Footer";
import { getProduct, getProducts } from "@/lib/shopify";
import { getProductStory, getRecipesForProduct } from "@/lib/sanity";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product" };
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const [product, story, allProducts, recipes] = await Promise.all([
    getProduct(id),
    getProductStory(id),
    getProducts(12),
    getRecipesForProduct(id, 4),
  ]);

  if (!product) notFound();

  const relatedProducts = allProducts
    .filter((p) => p.handle !== product.handle)
    .slice(0, 3);

  return (
    <>
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
