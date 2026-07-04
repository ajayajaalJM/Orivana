import type { MetadataRoute } from "next";
import { siteSeo } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteSeo.siteName,
    short_name: siteSeo.siteName,
    description: siteSeo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ef",
    theme_color: "#2c3a2e",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
