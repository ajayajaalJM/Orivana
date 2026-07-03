import { createClient } from "@sanity/client";
import { PERMANENT_COLLECTIONS } from "../lib/collections";
import { getJournalArticleBody, seedData } from "../lib/sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN. Aborting seed."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

function textToPortableText(text: string) {
  return text
    .split("\n\n")
    .filter(Boolean)
    .map((paragraph, index) => ({
      _type: "block" as const,
      _key: `block-${index}`,
      style: "normal" as const,
      markDefs: [],
      children: [
        {
          _type: "span" as const,
          _key: `span-${index}`,
          text: paragraph,
          marks: [] as string[],
        },
      ],
    }));
}

async function seedRecipes() {
  const docs = seedData.recipes.map((recipe) => ({
    _id: `recipe-${recipe.slug.current}`,
    _type: "recipe",
    title: recipe.title,
    slug: { _type: "slug", current: recipe.slug.current },
    description: recipe.description,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    relatedProductHandles: recipe.relatedProductHandles,
  }));

  for (const doc of docs) {
    await client.createOrReplace(doc);
  }
  console.log(`Seeded ${docs.length} recipes`);
}

async function seedJournalPosts() {
  const docs = seedData.journal.map((post) => ({
    _id: `journal-${post.slug.current}`,
    _type: "journalPost",
    title: post.title,
    slug: { _type: "slug", current: post.slug.current },
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    body: textToPortableText(getJournalArticleBody(post.slug.current)),
  }));

  for (const doc of docs) {
    await client.createOrReplace(doc);
  }
  console.log(`Seeded ${docs.length} journal posts`);
}

async function seedProductStories() {
  const docs = Object.entries(seedData.productStories).map(([handle, story]) => ({
    _id: `productStory-${handle}`,
    _type: "productStory",
    productHandle: handle,
    title: story.title,
    body: story.body,
  }));

  for (const doc of docs) {
    await client.createOrReplace(doc);
  }
  console.log(`Seeded ${docs.length} product stories`);
}

async function seedHomepage() {
  const { homepage } = seedData;
  await client.createOrReplace({
    _id: "homepage",
    _type: "homepage",
    hero: homepage.hero,
    featuredDrop: homepage.featuredDrop,
    brandStory: homepage.brandStory,
  });
  console.log("Seeded homepage");
}

async function seedCollectionEditorials() {
  const docs = PERMANENT_COLLECTIONS.map((collection) => ({
    _id: `collectionEditorial-${collection.handle}`,
    _type: "collectionEditorial",
    handle: collection.handle,
    title: collection.title,
    shortTitle: collection.shortTitle,
    heroIntro: collection.heroIntro,
    story: collection.story,
    featuredRecipe: {
      _type: "reference",
      _ref: `recipe-${collection.featuredRecipeSlug}`,
    },
    relatedJournalPosts: collection.journalSlugs.map((slug) => ({
      _type: "reference",
      _ref: `journal-${slug}`,
      _key: slug,
    })),
  }));

  for (const doc of docs) {
    await client.createOrReplace(doc);
  }
  console.log(`Seeded ${docs.length} collection editorials`);
}

async function main() {
  await seedRecipes();
  await seedJournalPosts();
  await seedProductStories();
  await seedHomepage();
  await seedCollectionEditorials();
  console.log("Sanity seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
