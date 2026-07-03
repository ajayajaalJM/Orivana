"use client";

import { CollectionShowcaseCard } from "@/components/collections/CollectionShowcaseCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { H2, Caption } from "@/components/ui/Typography";
import { brand } from "@/lib/brand";
import type { CollectionShowcaseItem } from "@/components/collections/CollectionShowcaseCard";

interface CollectionGridProps {
  collections: CollectionShowcaseItem[];
}

export function CollectionGrid({ collections }: CollectionGridProps) {
  if (collections.length === 0) return null;

  return (
    <Section>
      <Container wide>
        <ScrollReveal className="mb-10 sm:mb-[var(--space-2xl)]">
          <Caption className="mb-4 block sm:mb-6">{brand.collectionsCaption}</Caption>
          <H2>{brand.collectionsTitle}</H2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-10">
          {collections.map((collection, i) => (
            <ScrollReveal key={collection.handle} delay={i * 0.1}>
              <CollectionShowcaseCard collection={collection} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
