import { PERMANENT_COLLECTIONS } from "@/lib/collections";
import { absoluteUrl } from "@/lib/site";
import { getJournalPosts, getRecipes } from "@/lib/sanity";
import { getProducts } from "@/lib/shopify";

export type SitemapEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

const STATIC_ROUTES: Array<Omit<SitemapEntry, "url"> & { path: string }> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/collections", changeFrequency: "weekly", priority: 0.9 },
  { path: "/journal", changeFrequency: "weekly", priority: 0.8 },
  { path: "/recipes", changeFrequency: "weekly", priority: 0.8 },
  { path: "/story", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/membership", changeFrequency: "monthly", priority: 0.6 },
];

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const base = absoluteUrl("/");
  if (!base) return [];

  const now = new Date();
  const entries: SitemapEntry[] = STATIC_ROUTES.map(({ path, ...rest }) => ({
    url: absoluteUrl(path)!,
    lastModified: now,
    ...rest,
  }));

  for (const collection of PERMANENT_COLLECTIONS) {
    entries.push({
      url: absoluteUrl(`/collections/${collection.handle}`)!,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  const [products, journalPosts, recipes] = await Promise.all([
    getProducts(100),
    getJournalPosts(100),
    getRecipes(100),
  ]);

  for (const product of products) {
    entries.push({
      url: absoluteUrl(`/product/${product.handle}`)!,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const post of journalPosts) {
    entries.push({
      url: absoluteUrl(`/journal/${post.slug.current}`)!,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const recipe of recipes) {
    entries.push({
      url: absoluteUrl(`/recipes/${recipe.slug.current}`)!,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
