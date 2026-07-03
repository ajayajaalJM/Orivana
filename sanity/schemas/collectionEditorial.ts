export default {
  name: "collectionEditorial",
  title: "Collection Editorial",
  type: "document",
  fields: [
    {
      name: "handle",
      type: "string",
      title: "Shopify Collection Handle",
      description: "Must match: dates, olive-oil, honey, gift-collections",
    },
    { name: "title", type: "string" },
    { name: "shortTitle", type: "string" },
    { name: "heroIntro", type: "text" },
    {
      name: "story",
      type: "object",
      fields: [
        { name: "title", type: "string" },
        {
          name: "paragraphs",
          type: "array",
          of: [{ type: "text" }],
        },
      ],
    },
    { name: "heroImage", type: "image" },
    { name: "gridImage", type: "image" },
    {
      name: "featuredRecipe",
      type: "reference",
      to: [{ type: "recipe" }],
    },
    {
      name: "relatedJournalPosts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "journalPost" }] }],
    },
  ],
};
