export default {
  name: "recipe",
  title: "Harvest Recipe",
  type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "description", type: "text", title: "Sensory Description" },
    { name: "heroImage", type: "image" },
    {
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "productHandle", type: "string", title: "Shopify Product Handle" },
            { name: "quantity", type: "string" },
            { name: "origin", type: "string" },
          ],
        },
      ],
    },
    {
      name: "steps",
      title: "Recipe Steps",
      type: "array",
      of: [{ type: "text" }],
    },
    {
      name: "relatedProductHandles",
      title: "Related Product Handles",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
};
