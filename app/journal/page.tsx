import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { H2, Excerpt, Caption } from "@/components/ui/Typography";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { Footer } from "@/components/sections/Footer";
import { brand } from "@/lib/brand";
import { getJournalPosts, getJournalImageUrl, urlFor } from "@/lib/sanity";

export const metadata: Metadata = {
  title: brand.journalTitle,
  description: "Stories of land, harvest, and Mediterranean food heritage from Orivana.",
};

export default async function JournalPage() {
  const posts = await getJournalPosts(12);

  return (
    <>
      <Section className="page-top">
        <Container>
          <PageHeader
            title={brand.journalTitle}
            description="Stories of land, farming traditions, and the quiet rhythm of seasonal harvest."
          />

          <div className="grid grid-cols-1 gap-12 sm:gap-16 md:grid-cols-2">
            {posts.map((post, i) => {
              const imageUrl = post.mainImage
                ? urlFor(post.mainImage)
                : getJournalImageUrl(i);

              return (
                <Link
                  key={post._id}
                  href={`/journal/${post.slug.current}`}
                  className="group block"
                >
                  <ImageBlock src={imageUrl} alt={post.title} aspectRatio="landscape" />
                  <div className="mt-6 space-y-3 sm:mt-8">
                    <Caption className="block">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Caption>
                    <H2 className="!text-xl sm:!text-2xl">{post.title}</H2>
                    <Excerpt>{post.excerpt}</Excerpt>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
}
