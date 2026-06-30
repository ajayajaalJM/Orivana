export default {
  name: "journalPost",
  title: "Harvest Journal Post",
  type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "excerpt", type: "text" },
    { name: "publishedAt", type: "datetime" },
    { name: "mainImage", type: "image" },
    { name: "body", type: "array", of: [{ type: "block" }] },
  ],
};
