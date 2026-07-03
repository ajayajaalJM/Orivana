"use client";

import { CollectionShowcaseCard } from "@/components/collections/CollectionShowcaseCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { H2, Excerpt, Caption } from "@/components/ui/Typography";
import { brand } from "@/lib/brand";
import type { CollectionShowcaseItem } from "@/components/collections/CollectionShowcaseCard";

interface CollectionsLandingProps {
  collections: CollectionShowcaseItem[];
}

export function CollectionsLanding({ collections }: CollectionsLandingProps) {
  return (
    <>
      <Section className="page-top">
        <Container wide>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <Caption className="mb-6 block">{brand.collectionsCaption}</Caption>
            <H2 as="h1" className="page-title mb-6">
              {brand.collectionsLandingTitle}
            </H2>
            <Excerpt>{brand.collectionsLandingDescription}</Excerpt>
          </ScrollReveal>
        </Container>
      </Section>

      <Section>
        <Container wide>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-10">
            {collections.map((collection, i) => (
              <ScrollReveal key={collection.handle} delay={i * 0.1}>
                <CollectionShowcaseCard collection={collection} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
