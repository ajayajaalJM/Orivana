import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { H1, Excerpt, Body, Caption } from "@/components/ui/Typography";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { Footer } from "@/components/sections/Footer";
import { PortableTextBody } from "@/components/sanity/PortableTextBody";
import { getJournalPost, getJournalImageUrl, getJournalArticleBody, urlFor } from "@/lib/sanity";
import { createPageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) return { title: "Article" };
  const imageUrl = post.mainImage ? urlFor(post.mainImage) : getJournalImageUrl(0);
  return createPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/journal/${slug}`,
    images: [imageUrl],
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getJournalPost(slug);

  if (!post) notFound();

  const imageUrl = post.mainImage
    ? urlFor(post.mainImage)
    : getJournalImageUrl(0);

  const articleBody = getJournalArticleBody(slug);
  const hasCmsBody = Array.isArray(post.body) && post.body.length > 0;

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(post, imageUrl),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/journal" },
            { name: post.title, path: `/journal/${slug}` },
          ]),
        ]}
      />
      <Section className="page-top">
        <Container>
          <article className="mx-auto max-w-3xl">
            <Caption className="mb-4 block">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Caption>
            <H1 className="page-title mb-6 sm:mb-8">{post.title}</H1>
            <div className="mb-10 sm:mb-12">
              <ImageBlock src={imageUrl} alt={post.title} aspectRatio="landscape" />
            </div>
            <Excerpt className="text-[var(--color-text)]">{post.excerpt}</Excerpt>
            {hasCmsBody ? (
              <PortableTextBody
                value={post.body!}
                className="mt-8 text-lg leading-[1.9] text-[var(--color-text)] sm:text-xl sm:leading-[1.85]"
              />
            ) : (
              <Body className="mt-8 text-lg leading-[1.9] sm:text-xl sm:leading-[1.85]">
                {articleBody}
              </Body>
            )}
          </article>
        </Container>
      </Section>
      <Footer />
    </>
  );
}
