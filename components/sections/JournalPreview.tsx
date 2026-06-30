"use client";

import Link from "next/link";
import { TextLink } from "@/components/ui/TextLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { H2, H3, Excerpt, Caption } from "@/components/ui/Typography";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { brand } from "@/lib/brand";
import { getJournalImageUrl, urlFor, type JournalPost } from "@/lib/sanity";

interface JournalPreviewProps {
  posts: JournalPost[];
}

export function JournalPreview({ posts }: JournalPreviewProps) {
  const [featured, ...rest] = posts;

  return (
    <Section dark>
      <Container wide>
        <ScrollReveal className="mb-10 sm:mb-[var(--space-2xl)]">
          <Caption className="mb-6 block">{brand.journalTitle}</Caption>
          <H2>{brand.journalSubtitle}</H2>
        </ScrollReveal>

        {featured && (
          <ScrollReveal className="mb-10 sm:mb-[var(--space-2xl)]">
            <Link href={`/journal/${featured.slug.current}`} className="group grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-[var(--space-2xl)]">
              <ImageBlock
                src={
                  featured.mainImage
                    ? urlFor(featured.mainImage)
                    : getJournalImageUrl(0)
                }
                alt={featured.title}
                aspectRatio="landscape"
                hoverZoom
              />
              <div className="flex flex-col justify-center gap-5 sm:gap-8 lg:py-[var(--space-xl)]">
                <Caption>
                  {new Date(featured.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </Caption>
                <H2 className="group-hover:text-[var(--color-text)]/80 transition-colors duration-500">
                  {featured.title}
                </H2>
                <Excerpt className="max-w-md">{featured.excerpt}</Excerpt>
                <span className="text-sm font-light tracking-wide text-[var(--color-muted)] transition-colors duration-500 group-hover:text-[var(--color-text)]">
                  Read Article →
                </span>
              </div>
            </Link>
          </ScrollReveal>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-1 gap-12 sm:gap-[var(--space-2xl)] md:grid-cols-2">
            {rest.map((post, i) => {
              const imageUrl = post.mainImage
                ? urlFor(post.mainImage)
                : getJournalImageUrl(i + 1);

              return (
                <ScrollReveal key={post._id} delay={i * 0.1}>
                  <Link href={`/journal/${post.slug.current}`} className="group block">
                    <ImageBlock src={imageUrl} alt={post.title} aspectRatio="landscape" hoverZoom />
                    <div className="mt-8 space-y-4">
                      <Caption>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </Caption>
                      <H3 className="group-hover:text-[var(--color-text)]/80 transition-colors duration-500">
                        {post.title}
                      </H3>
                      <Excerpt>{post.excerpt}</Excerpt>
                      <span className="inline-block text-xs font-light tracking-wide text-[var(--color-muted)] transition-colors duration-500 group-hover:text-[var(--color-text)]">
                        Read more →
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        <ScrollReveal className="mt-[var(--space-2xl)]">
          <TextLink href="/journal">View the journal →</TextLink>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
