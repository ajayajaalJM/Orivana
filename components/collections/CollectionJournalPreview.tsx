import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { H2, Excerpt, Caption } from "@/components/ui/Typography";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { brand } from "@/lib/brand";
import { getJournalImageUrl, urlFor, type JournalPost } from "@/lib/sanity";

interface CollectionJournalPreviewProps {
  posts: JournalPost[];
}

export function CollectionJournalPreview({ posts }: CollectionJournalPreviewProps) {
  if (posts.length === 0) return null;

  return (
    <Section dark>
      <Container wide>
        <H2 className="mb-10 sm:mb-14">{brand.journalTitle}</H2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-[var(--space-2xl)]">
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
                <ImageBlock src={imageUrl} alt={post.title} aspectRatio="landscape" hoverZoom />
                <div className="mt-6 space-y-3">
                  <Caption>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
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
  );
}
