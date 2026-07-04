import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { Excerpt } from "@/components/ui/Typography";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { brand } from "@/lib/brand";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { getBrandStoryPage, getBrandStoryImageUrl, urlFor } from "@/lib/sanity";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const story = await getBrandStoryPage();
  const imageUrl = story.image ? urlFor(story.image) : getBrandStoryImageUrl();

  return createPageMetadata({
    title: "Our Story",
    description: `${brand.tagline} — premium dates, olive oil, and raw honey from Mediterranean lands.`,
    path: "/story",
    images: [imageUrl],
  });
}

export default async function StoryPage() {
  const story = await getBrandStoryPage();
  const imageUrl = story.image ? urlFor(story.image) : getBrandStoryImageUrl();
  const paragraphs = story.body.split("\n\n");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Our Story", path: "/story" },
        ])}
      />
      <Section className="page-top">
        <Container>
          <div className="grid grid-cols-1 gap-12 sm:gap-16 lg:grid-cols-2">
            <ImageBlock src={imageUrl} alt={story.title} aspectRatio="portrait" />
            <div className="flex flex-col justify-center gap-6 sm:gap-8">
              <PageHeader title={story.title} className="mb-0 sm:mb-0" />
              {paragraphs.map((p, i) => (
                <Excerpt key={i}>{p}</Excerpt>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
}
