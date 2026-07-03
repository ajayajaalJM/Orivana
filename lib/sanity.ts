import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/types";
import {
  getFallbackCollectionEditorial,
  type CollectionEditorial,
  type CollectionHandle,
} from "./collections";
import { images, img } from "./images";

export interface SanityImage {
  _type: "image";
  asset: { _ref: string };
  alt?: string;
}

export interface HomepageData {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    backgroundImage?: SanityImage;
    backgroundVideoUrl?: string;
  };
  featuredDrop: {
    productHandle?: string;
    editorialDescription: string;
  };
  brandStory: {
    title: string;
    body: string;
    ctaText: string;
    image?: SanityImage;
  };
}

export interface JournalPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  mainImage?: SanityImage;
  body?: PortableTextBlock[];
}

export interface ProductStory {
  title: string;
  body: string;
}

export interface RecipeIngredient {
  productHandle: string;
  quantity: string;
  origin?: string;
}

export interface Recipe {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  heroImage?: SanityImage;
  ingredients: RecipeIngredient[];
  steps: string[];
  relatedProductHandles: string[];
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";

export const sanityClient = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlFor(source: SanityImage) {
  if (!builder) return "";
  return builder.image(source).url();
}

const MOCK_HOMEPAGE: HomepageData = {
  hero: {
    title: "ORIVANA",
    subtitle: "A House of Mediterranean Craft",
    ctaText: "Explore the Collection",
    backgroundVideoUrl: undefined,
  },
  featuredDrop: {
    productHandle: "medjool-dates-al-kufra",
    editorialDescription:
      "Hand-selected Medjool dates from desert groves — where heat concentrates sweetness into amber depth.",
  },
  brandStory: {
    title: "The Land, The Light, The Craft",
    body: "Orivana was born from a reverence for Mediterranean land — sun-drenched groves, ancient palms, and wild coastal flora.\n\nOur dates are born in silence, beneath desert heat and slow winds. Our olive oil is pressed within hours of harvest, preserving green intensity. Our honey is gathered raw, never heated, never hurried.\n\nWe work with generational harvesters who understand that luxury is patience — the rhythm of seasons, not the pace of markets.",
    ctaText: "Discover the Story",
  },
};

const MOCK_JOURNAL: JournalPost[] = [
  {
    _id: "1",
    title: "The Silent Work of Olive Harvesting",
    slug: { current: "silent-work-of-olive-harvesting" },
    excerpt:
      "Before dawn, hands move through ancient branches — a ritual unchanged for centuries along the Mediterranean coast.",
    publishedAt: "2025-03-15",
    mainImage: undefined,
  },
  {
    _id: "2",
    title: "Inside the Palm Groves of the Sahara",
    slug: { current: "palm-groves-of-the-sahara" },
    excerpt:
      "Deep in southern valleys, desert heat sculpts each date into a vessel of concentrated sweetness.",
    publishedAt: "2025-02-28",
    mainImage: undefined,
  },
  {
    _id: "3",
    title: "The Ancient Language of Honey",
    slug: { current: "ancient-language-of-honey" },
    excerpt:
      "Wild bees carry the memory of flora across hillsides — each jar a portrait of a single season.",
    publishedAt: "2025-01-10",
    mainImage: undefined,
  },
];

const JOURNAL_IMAGES = [
  img(images.oliveGrove, 800),       // olive harvesting
  img(images.datesRows, 800),        // palm groves / desert dates
  img(images.honeycomb, 800),        // honey article
];

const PRODUCT_STORIES: Record<string, ProductStory> = {
  "medjool-dates-al-kufra": {
    title: "From Desert Grove to Stone Bowl",
    body: "Grown in the deep southern valleys where desert heat concentrates natural sugars, these Medjool dates carry a soft caramel richness and a dense, syrup-like texture. Each fruit is hand-selected at peak ripeness — never rushed, never machine-harvested. In Al Kufra, dates are not merely food; they are ceremony, offered to guests as a gesture of hospitality passed through generations.",
  },
  "coastal-olive-oil": {
    title: "Pressed Within Hours",
    body: "Sourced from coastal groves where sea air meets ancient stone, this oil is cold-pressed within hours of harvest. The result is a green-gold liquid with a peppered finish and the bright intensity of fruit picked at its moment. Traditional stone mills preserve what industrial extraction cannot — the quiet complexity of the olive itself.",
  },
  "raw-wildflower-honey": {
    title: "Gathered, Never Heated",
    body: "From wild Mediterranean hillsides, our bees forage among thyme, rosemary, and wild lavender. The honey is gathered raw — unfiltered, unprocessed, never heated above what the hive itself provides. Thick and luminous, it holds the amber memory of a single season in every spoonful.",
  },
  "deglet-noor-dates": {
    title: "The Translucent Date",
    body: "Known as the 'date of light' for its translucent amber skin, Deglet Noor is prized across North Africa for its delicate honeyed sweetness and firm, elegant texture. Harvested from oasis groves where palm shadows stretch across sand at golden hour.",
  },
  "seasonal-harvest-box": {
    title: "A Season in Three Vessels",
    body: "Each seasonal selection brings together the finest expression of Orivana's three pillars — dates, olive oil, and honey — curated to reflect the current harvest. Limited batches, never repeated exactly.",
  },
};

const RECIPE_IMAGES = [
  img(images.datesBowl, 1920),
  img(images.mediterraneanSpread, 1920),
  img(images.honeyDipper, 1920),
];

const MOCK_RECIPES: Recipe[] = [
  {
    _id: "r1",
    title: "Warm Medjool Dates with Olive Oil & Sea Salt",
    slug: { current: "warm-medjool-dates-olive-oil-sea-salt" },
    description:
      "A quiet ritual of desert sweetness — dates warmed until their caramel depth releases, finished with green-gold oil and coarse salt.",
    ingredients: [
      { productHandle: "medjool-dates-al-kufra", quantity: "6 dates", origin: "Al Kufra Valley" },
      { productHandle: "coastal-olive-oil", quantity: "2 tbsp", origin: "Coastal Groves" },
    ],
    steps: [
      "Place the dates in a shallow ceramic bowl, arranged with space between each fruit.",
      "Warm them slowly under low heat until their surface begins to soften and release natural sugars — patience is the only ingredient you cannot buy.",
      "Drizzle the olive oil in a thin stream across the dates, allowing it to pool gently at the base.",
      "Finish with a pinch of sea salt. Serve warm, in silence.",
    ],
    relatedProductHandles: ["medjool-dates-al-kufra", "coastal-olive-oil"],
  },
  {
    _id: "r2",
    title: "Honey & Date Morning Ritual",
    slug: { current: "honey-date-morning-ritual" },
    description:
      "A morning ceremony of amber and light — translucent dates cradled in raw wildflower honey.",
    ingredients: [
      { productHandle: "deglet-noor-dates", quantity: "4 dates", origin: "Oasis Groves" },
      { productHandle: "raw-wildflower-honey", quantity: "3 tbsp", origin: "Mediterranean Hills" },
    ],
    steps: [
      "Slice each date lengthwise, revealing the soft interior without separating the halves entirely.",
      "Spoon the honey slowly into each cavity, allowing it to settle into the fruit's natural sweetness.",
      "Arrange on a stone plate. Let the honey reach room temperature before serving — cold masks its complexity.",
      "Eat with your hands. No utensils required.",
    ],
    relatedProductHandles: ["deglet-noor-dates", "raw-wildflower-honey"],
  },
  {
    _id: "r3",
    title: "The Mediterranean Harvest Board",
    slug: { current: "mediterranean-harvest-board" },
    description:
      "An assembly of land and season — dates, oil, and honey arranged as a living still life.",
    ingredients: [
      { productHandle: "medjool-dates-al-kufra", quantity: "8 dates", origin: "Al Kufra Valley" },
      { productHandle: "coastal-olive-oil", quantity: "4 tbsp", origin: "Coastal Groves" },
      { productHandle: "raw-wildflower-honey", quantity: "2 tbsp", origin: "Mediterranean Hills" },
    ],
    steps: [
      "Select a wooden board or stone slab as your canvas — the surface matters as much as the ingredients.",
      "Arrange the dates in a loose arc, varying orientation to create visual rhythm.",
      "Pour olive oil into a small ceramic vessel and place at the center — a pool of liquid gold.",
      "Drizzle honey across the dates in thin threads, connecting each element into a single composition.",
      "Serve at room temperature. This is not a dish to rush.",
    ],
    relatedProductHandles: [
      "medjool-dates-al-kufra",
      "coastal-olive-oil",
      "raw-wildflower-honey",
      "seasonal-harvest-box",
    ],
  },
  {
    _id: "r4",
    title: "Burrata with Estate Olive Oil",
    slug: { current: "burrata-estate-olive-oil" },
    description:
      "Fresh burrata dressed with green-gold oil — a study in restraint, where a single pour transforms simplicity into ceremony.",
    ingredients: [
      { productHandle: "coastal-olive-oil", quantity: "3 tbsp", origin: "Coastal Groves" },
    ],
    steps: [
      "Bring the burrata to room temperature — cold masks its creaminess.",
      "Place at the centre of a shallow ceramic plate, allowing space for oil to pool.",
      "Pour the olive oil in a slow, continuous stream from a height — let it cascade across the cheese.",
      "Finish with flaky salt and cracked pepper. Serve immediately, with warm bread at the side.",
    ],
    relatedProductHandles: ["coastal-olive-oil"],
  },
];

export function getRecipeImageUrl(index: number): string {
  return RECIPE_IMAGES[index % RECIPE_IMAGES.length];
}

export async function getRecipes(limit = 12): Promise<Recipe[]> {
  if (!sanityClient) return MOCK_RECIPES.slice(0, limit);

  try {
    const recipes = await sanityClient.fetch<Recipe[]>(`
      *[_type == "recipe"] | order(_createdAt desc)[0...$limit] {
        _id, title, slug, description, heroImage,
        ingredients[] { productHandle, quantity, origin },
        steps,
        relatedProductHandles
      }
    `, { limit });
    return recipes.length ? recipes : MOCK_RECIPES.slice(0, limit);
  } catch {
    return MOCK_RECIPES.slice(0, limit);
  }
}

export async function getRecipe(slug: string): Promise<Recipe | null> {
  if (!sanityClient) {
    return MOCK_RECIPES.find((r) => r.slug.current === slug) ?? null;
  }

  try {
    return await sanityClient.fetch<Recipe>(`
      *[_type == "recipe" && slug.current == $slug][0] {
        _id, title, slug, description, heroImage,
        ingredients[] { productHandle, quantity, origin },
        steps,
        relatedProductHandles
      }
    `, { slug });
  } catch {
    return MOCK_RECIPES.find((r) => r.slug.current === slug) ?? null;
  }
}

export async function getRecipesForProduct(handle: string, limit = 4): Promise<Recipe[]> {
  const all = await getRecipes(20);
  return all
    .filter(
      (r) =>
        r.relatedProductHandles.includes(handle) ||
        r.ingredients.some((i) => i.productHandle === handle)
    )
    .slice(0, limit);
}

export function getJournalImageUrl(index: number): string {
  return JOURNAL_IMAGES[index % JOURNAL_IMAGES.length];
}

export function getBrandStoryImageUrl(): string {
  return img(images.oliveGrove);
}

export function getHeroBackgroundUrl(): string {
  return img(images.heroCoast, 1920);
}

export async function getHomepage(): Promise<HomepageData> {
  if (!sanityClient) return MOCK_HOMEPAGE;

  try {
    const data = await sanityClient.fetch<HomepageData>(`
      *[_type == "homepage"][0] {
        hero { title, subtitle, ctaText, backgroundImage, backgroundVideoUrl },
        featuredDrop { productHandle, editorialDescription },
        brandStory { title, body, ctaText, image }
      }
    `);
    return data ?? MOCK_HOMEPAGE;
  } catch {
    return MOCK_HOMEPAGE;
  }
}

export async function getJournalPosts(limit = 3): Promise<JournalPost[]> {
  if (!sanityClient) return MOCK_JOURNAL.slice(0, limit);

  try {
    const posts = await sanityClient.fetch<JournalPost[]>(`
      *[_type == "journalPost"] | order(publishedAt desc)[0...$limit] {
        _id, title, slug, excerpt, publishedAt, mainImage
      }
    `, { limit });
    return posts.length ? posts : MOCK_JOURNAL.slice(0, limit);
  } catch {
    return MOCK_JOURNAL.slice(0, limit);
  }
}

export async function getJournalPost(slug: string): Promise<JournalPost | null> {
  if (!sanityClient) {
    return MOCK_JOURNAL.find((p) => p.slug.current === slug) ?? null;
  }

  try {
    return await sanityClient.fetch<JournalPost>(`
      *[_type == "journalPost" && slug.current == $slug][0] {
        _id, title, slug, excerpt, publishedAt, mainImage, body
      }
    `, { slug });
  } catch {
    return MOCK_JOURNAL.find((p) => p.slug.current === slug) ?? null;
  }
}

export async function getProductStory(handle: string): Promise<ProductStory | null> {
  if (!sanityClient) {
    return (
      PRODUCT_STORIES[handle] ?? {
        title: "The Harvest",
        body: "Every Orivana selection begins with land and season — harvested by hand, processed with minimal intervention, and offered at the moment of peak expression.",
      }
    );
  }

  try {
    const story = await sanityClient.fetch<ProductStory>(`
      *[_type == "productStory" && productHandle == $handle][0] {
        title, body
      }
    `, { handle });
    return story ?? PRODUCT_STORIES[handle] ?? null;
  } catch {
    return PRODUCT_STORIES[handle] ?? null;
  }
}

export async function getBrandStoryPage(): Promise<{ title: string; body: string; image?: SanityImage }> {
  const homepage = await getHomepage();
  return {
    title: homepage.brandStory.title,
    body: homepage.brandStory.body,
    image: homepage.brandStory.image,
  };
}

export function getJournalArticleBody(slug: string): string {
  const bodies: Record<string, string> = {
    "silent-work-of-olive-harvesting":
      "The harvest begins before the sun rises over the coastal groves. Workers move through rows of ancient trees, selecting fruit by hand — never by machine. Each olive must be at its precise moment: firm enough to press, ripe enough to yield green-gold intensity. Within hours, the fruit enters the mill. This is the covenant of quality — time, not technology, governs the process.",
    "palm-groves-of-the-sahara":
      "In the deep valleys of the Sahara fringe, palm groves rise from sand like monuments to patience. Here, dates mature slowly beneath relentless sun. The harvest is manual, generational — families who have read the ripeness of fruit by touch alone. What reaches Orivana is not commodity. It is the concentrated sweetness of desert silence.",
    "ancient-language-of-honey":
      "Honey speaks in seasons. Spring brings light floral notes from wild thyme; late summer deepens into amber complexity. Our beekeepers never feed, never hurry, never heat. The honeycomb is cut, the honey flows — raw, unfiltered, holding the memory of every flower visited. To taste it is to read a landscape.",
  };
  return (
    bodies[slug] ??
    "Stories of land, harvest, and tradition from the Orivana atelier — where Mediterranean craft meets quiet luxury."
  );
}

interface SanityCollectionEditorial {
  handle: CollectionHandle;
  title: string;
  shortTitle: string;
  heroIntro: string;
  story: { title: string; paragraphs: string[] };
  heroImage?: SanityImage;
  gridImage?: SanityImage;
  featuredRecipe?: Recipe | null;
  relatedJournalPosts?: JournalPost[];
}

export async function getCollectionEditorial(
  handle: string
): Promise<CollectionEditorial | undefined> {
  const fallback = getFallbackCollectionEditorial(handle);

  if (!sanityClient) return fallback;

  try {
    const data = await sanityClient.fetch<SanityCollectionEditorial | null>(
      `*[_type == "collectionEditorial" && handle == $handle][0] {
        handle,
        title,
        shortTitle,
        heroIntro,
        story { title, paragraphs },
        heroImage,
        gridImage,
        "featuredRecipe": featuredRecipe-> {
          _id, title, slug, description, heroImage,
          ingredients[] { productHandle, quantity, origin },
          steps,
          relatedProductHandles
        },
        "relatedJournalPosts": relatedJournalPosts[]-> {
          _id, title, slug, excerpt, publishedAt, mainImage
        }
      }`,
      { handle }
    );

    if (!data) return fallback;

    return {
      handle: data.handle,
      title: data.title,
      shortTitle: data.shortTitle,
      heroIntro: data.heroIntro,
      story: data.story,
      heroImage: data.heroImage ? urlFor(data.heroImage) : fallback?.heroImage ?? "",
      gridImage: data.gridImage ? urlFor(data.gridImage) : fallback?.gridImage ?? "",
      featuredRecipeSlug:
        data.featuredRecipe?.slug.current ?? fallback?.featuredRecipeSlug ?? "",
      journalSlugs:
        data.relatedJournalPosts?.map((post) => post.slug.current) ??
        fallback?.journalSlugs ??
        [],
      featuredRecipe: data.featuredRecipe ?? fallback?.featuredRecipe ?? null,
      journalPosts: data.relatedJournalPosts ?? fallback?.journalPosts ?? [],
    };
  } catch {
    return fallback;
  }
}

/** Seed helpers — used by scripts/seed-sanity.ts */
export const seedData = {
  homepage: MOCK_HOMEPAGE,
  journal: MOCK_JOURNAL,
  recipes: MOCK_RECIPES,
  productStories: PRODUCT_STORIES,
};
