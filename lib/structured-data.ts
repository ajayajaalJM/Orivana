import { siteSeo } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import type { JournalPost, Recipe } from "@/lib/sanity";
import type { ShopifyProduct } from "@/lib/shopify";

export const ORGANIZATION_SAME_AS = ["https://instagram.com/orivanastore"] as const;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteSeo.siteName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon"),
    description: siteSeo.description,
    email: "concierge@orivana.com",
    sameAs: [...ORGANIZATION_SAME_AS],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteSeo.siteName,
    url: absoluteUrl("/"),
    description: siteSeo.description,
    publisher: {
      "@type": "Organization",
      name: siteSeo.siteName,
    },
  };
}

export function productJsonLd(product: ShopifyProduct) {
  const variant = product.variants[0];
  const image = product.featuredImage?.url ?? product.images[0]?.url;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: image ? [image] : undefined,
    sku: variant?.id,
    brand: {
      "@type": "Brand",
      name: siteSeo.siteName,
    },
    offers: variant
      ? {
          "@type": "Offer",
          url: absoluteUrl(`/product/${product.handle}`),
          priceCurrency: variant.price.currencyCode,
          price: variant.price.amount,
          availability: variant.availableForSale
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        }
      : undefined,
  };
}

export function articleJsonLd(post: JournalPost, imageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: siteSeo.siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteSeo.siteName,
    },
    mainEntityOfPage: absoluteUrl(`/journal/${post.slug.current}`),
  };
}

export function recipeJsonLd(recipe: Recipe, imageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: imageUrl ? [imageUrl] : undefined,
    recipeIngredient: recipe.ingredients.map((ingredient) =>
      [ingredient.quantity, ingredient.origin].filter(Boolean).join(" ").trim()
    ),
    recipeInstructions: recipe.steps.map((step) => ({
      "@type": "HowToStep",
      text: step,
    })),
    author: {
      "@type": "Organization",
      name: siteSeo.siteName,
    },
  };
}

export function itemListJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Orivana",
    url: absoluteUrl("/contact"),
    mainEntity: {
      "@type": "Organization",
      name: siteSeo.siteName,
      email: "concierge@orivana.com",
      url: absoluteUrl("/"),
      sameAs: [...ORGANIZATION_SAME_AS],
    },
  };
}
