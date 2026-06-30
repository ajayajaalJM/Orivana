export default {
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    {
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        { name: "title", type: "string", initialValue: "ORIVANA" },
        { name: "subtitle", type: "string", initialValue: "A House of Mediterranean Craft" },
        { name: "ctaText", type: "string", initialValue: "Explore Collection" },
        { name: "backgroundImage", type: "image" },
        { name: "backgroundVideoUrl", type: "url" },
      ],
    },
    {
      name: "featuredDrop",
      title: "Featured Harvest",
      type: "object",
      fields: [
        { name: "editorialDescription", type: "text" },
      ],
    },
    {
      name: "brandStory",
      title: "Brand Story",
      type: "object",
      fields: [
        { name: "title", type: "string", initialValue: "The Land, The Light, The Craft" },
        { name: "body", type: "text" },
        { name: "ctaText", type: "string", initialValue: "Discover the Story" },
        { name: "image", type: "image" },
      ],
    },
  ],
};
