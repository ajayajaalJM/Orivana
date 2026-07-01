import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

type MetadataOptions = {
  title: string;
  description?: string;
  path: string;
  images?: string[];
};

/** Build page metadata with canonical and Open Graph URLs from NEXT_PUBLIC_SITE_URL. */
export function createPageMetadata({
  title,
  description,
  path,
  images,
}: MetadataOptions): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    ...(description ? { description } : {}),
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title,
      ...(description ? { description } : {}),
      ...(url ? { url } : {}),
      ...(images?.length ? { images } : {}),
    },
  };
}

export function getSiteMetadataBase(): URL | undefined {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return url ? new URL(url) : undefined;
}
