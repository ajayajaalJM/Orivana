import { images, img } from "./images";

export type CollectionHandle = "dates" | "olive-oil" | "honey" | "gift-collections";

export interface CollectionEditorial {
  handle: CollectionHandle;
  title: string;
  shortTitle: string;
  heroIntro: string;
  story: {
    title: string;
    paragraphs: string[];
  };
  heroImage: string;
  gridImage: string;
  featuredRecipeSlug: string;
  journalSlugs: string[];
}

export const PERMANENT_COLLECTIONS: CollectionEditorial[] = [
  {
    handle: "dates",
    title: "Dates",
    shortTitle: "Dates",
    heroIntro:
      "From desert groves where heat sculpts each fruit into concentrated sweetness — a heritage of slow cultivation and generational craft.",
    story: {
      title: "The Desert Remembers",
      paragraphs: [
        "Beneath the palms of southern valleys, dates ripen in silence. Heat and wind do the work that no machine can replicate — drawing moisture from the fruit until only amber depth remains.",
        "Our selections come from groves tended across generations. Each harvest is hand-cut at peak ripeness, never rushed. Medjool carries caramel richness; Deglet Noor holds translucent elegance.",
        "In Mediterranean tradition, the date is ceremony — offered to guests as a gesture of hospitality that predates commerce itself.",
      ],
    },
    heroImage: img(images.datesRows, 1920),
    gridImage: img(images.datesBowl, 800),
    featuredRecipeSlug: "warm-medjool-dates-olive-oil-sea-salt",
    journalSlugs: ["palm-groves-of-the-sahara", "ancient-language-of-honey"],
  },
  {
    handle: "olive-oil",
    title: "Extra Virgin Olive Oil",
    shortTitle: "Olive Oil",
    heroIntro:
      "Cold-pressed within hours of harvest from ancient groves — green-gold intensity shaped by Mediterranean light and family tradition.",
    story: {
      title: "Pressed Within Hours",
      paragraphs: [
        "Along coastal terraces and inland groves, olive trees stand as witnesses to centuries of craft. The harvest begins before dawn, when fruit still holds the cool of night.",
        "Our oils are cold-pressed within hours of picking — never stored, never delayed. Stone mills preserve the peppered finish and bright intensity that industrial extraction cannot.",
        "Each bottle carries the quiet complexity of a single estate, a single season, a single expression of land.",
      ],
    },
    heroImage: img(images.oliveGrove, 1920),
    gridImage: img(images.oliveOil, 800),
    featuredRecipeSlug: "burrata-estate-olive-oil",
    journalSlugs: ["silent-work-of-olive-harvesting"],
  },
  {
    handle: "honey",
    title: "Raw Honey",
    shortTitle: "Honey",
    heroIntro:
      "Gathered raw from wild Mediterranean hillsides — unfiltered, unheated, holding the amber memory of thyme, rosemary, and a single season.",
    story: {
      title: "The Language of Flora",
      paragraphs: [
        "Wild bees move through thyme and rosemary across sun-warmed hillsides. Each forage creates a portrait — floral, mineral, luminous — that cannot be replicated.",
        "Our honey is gathered with patience. Never heated above what the hive itself provides. Never filtered beyond what nature allows.",
        "Traditional apiaries honour the rhythm of seasons. What arrives in the jar is not sweetness alone — it is landscape, distilled.",
      ],
    },
    heroImage: img(images.honeycomb, 1920),
    gridImage: img(images.honeyDipper, 800),
    featuredRecipeSlug: "honey-date-morning-ritual",
    journalSlugs: ["ancient-language-of-honey"],
  },
  {
    handle: "gift-collections",
    title: "Gift Collections",
    shortTitle: "Gifts",
    heroIntro:
      "Thoughtfully curated selections celebrating the finest harvests of the Mediterranean — composed for gifting, ceremony, and quiet celebration.",
    story: {
      title: "Curated for Ceremony",
      paragraphs: [
        "Gift Collections are not assembled — they are composed. Each curated gift brings together selections from across the house, arranged with the restraint of a luxury atelier.",
        "Dates beside olive oil. Honey cradled in linen. Every presentation considers texture, weight, and the unhurried pleasure of opening something rare.",
        "Whether for celebration, correspondence, or corporate gesture — these are experiences, not packages.",
      ],
    },
    heroImage: img(images.mediterraneanSpread, 1920),
    gridImage: img(images.mediterraneanSpread, 800),
    featuredRecipeSlug: "mediterranean-harvest-board",
    journalSlugs: ["palm-groves-of-the-sahara", "silent-work-of-olive-harvesting"],
  },
];

export function getCollectionEditorial(handle: string): CollectionEditorial | undefined {
  return PERMANENT_COLLECTIONS.find((c) => c.handle === handle);
}

export function getAllCollectionHandles(): CollectionHandle[] {
  return PERMANENT_COLLECTIONS.map((c) => c.handle);
}

/** Product filter metadata keys stored on ShopifyProduct */
export type ProductFilterMeta = {
  productType?: string;
  origin?: string;
  harvest?: string;
  availability?: string;
  giftReady?: boolean;
  packaging?: string;
};

export const REFINE_FILTER_GROUPS = [
  { key: "productType" as const, label: "Selection Type" },
  { key: "origin" as const, label: "Origin" },
  { key: "harvest" as const, label: "Harvest" },
  { key: "availability" as const, label: "Availability" },
  { key: "packaging" as const, label: "Presentation" },
] as const;

export function productInCollection(
  productCollections: string[] | undefined,
  handle: string
): boolean {
  if (!productCollections?.length) return false;
  return productCollections.includes(handle);
}
