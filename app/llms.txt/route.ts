import { NextResponse } from "next/server";
import { PERMANENT_COLLECTIONS } from "@/lib/collections";
import { siteSeo } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { getJournalPosts, getRecipes } from "@/lib/sanity";
import { getProducts } from "@/lib/shopify";

export const revalidate = 3600;

export async function GET() {
  const siteUrl = getSiteUrl() ?? "https://www.orivana.store";
  const [products, journalPosts, recipes] = await Promise.all([
    getProducts(100),
    getJournalPosts(100),
    getRecipes(100),
  ]);

  const lines = [
    `# ${siteSeo.siteName}`,
    "",
    `> ${siteSeo.description}`,
    "",
    "## About",
    "Orivana is a luxury Mediterranean heritage food house offering premium dates, cold-pressed olive oil, and raw honey — ethically sourced and shipped worldwide.",
    "",
    "## Key pages",
    `- Shop: ${siteUrl}/shop`,
    `- Collections: ${siteUrl}/collections`,
    `- Journal: ${siteUrl}/journal`,
    `- Recipes: ${siteUrl}/recipes`,
    `- Our Story: ${siteUrl}/story`,
    `- Inner Circle: ${siteUrl}/membership`,
    `- Contact: ${siteUrl}/contact`,
    "",
    "## Product categories",
    ...PERMANENT_COLLECTIONS.map(
      (collection) => `- ${collection.title}: ${siteUrl}/collections/${collection.handle}`
    ),
    "",
    "## Products",
    ...products.map((product) => `- ${product.title}: ${siteUrl}/product/${product.handle}`),
    "",
    "## Journal",
    ...journalPosts.map(
      (post) => `- ${post.title}: ${siteUrl}/journal/${post.slug.current}`
    ),
    "",
    "## Recipes",
    ...recipes.map(
      (recipe) => `- ${recipe.title}: ${siteUrl}/recipes/${recipe.slug.current}`
    ),
    "",
    "## Contact",
    "- Email: concierge@orivana.com",
    "- Instagram: https://instagram.com/orivanastore",
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
