import type { Metadata } from "next";
import { getDefaultOpenGraphImages, siteSeo } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

type MetadataOptions = {
  title: string;
  description?: string;
  path: string;
  images?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

function resolveOgImages(images: string[] | undefined, metadataBase: URL | undefined): string[] {
  if (images?.length) {
    return images.map((image) =>
      image.startsWith("http") ? image : metadataBase ? new URL(image, metadataBase).toString() : image
    );
  }
  return getDefaultOpenGraphImages(metadataBase).map((image) => image.url);
}

/** Build page metadata with canonical and Open Graph URLs from NEXT_PUBLIC_SITE_URL. */
export function createPageMetadata({
  title,
  description,
  path,
  images,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
  absoluteTitle = false,
}: MetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const metadataBase = getSiteMetadataBase();
  const ogImages = resolveOgImages(images, metadataBase);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    ...(description ? { description } : {}),
    ...(url ? { alternates: { canonical: url } } : {}),
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      ...(description ? { description } : { description: siteSeo.description }),
      siteName: siteSeo.siteName,
      type,
      ...(url ? { url } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      ...(description ? { description } : { description: siteSeo.description }),
      images: ogImages,
    },
  };
}

export function getSiteMetadataBase(): URL | undefined {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return url ? new URL(url) : undefined;
}

export function getRootMetadata(): Metadata {
  const metadataBase = getSiteMetadataBase();
  const ogImages = getDefaultOpenGraphImages(metadataBase);

  return {
    ...(metadataBase ? { metadataBase } : {}),
    title: {
      default: siteSeo.title,
      template: "%s | Orivana",
    },
    description: siteSeo.description,
    openGraph: {
      title: siteSeo.title,
      description: siteSeo.description,
      siteName: siteSeo.siteName,
      type: "website",
      ...(metadataBase ? { url: metadataBase.toString() } : {}),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: siteSeo.title,
      description: siteSeo.description,
      images: ogImages.map((image) => image.url),
    },
    alternates: metadataBase ? { canonical: metadataBase.toString() } : undefined,
  };
}
