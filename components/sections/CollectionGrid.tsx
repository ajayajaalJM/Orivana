"use client";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { H2, Caption } from "@/components/ui/Typography";
import { CollectionCard } from "@/components/shop/CollectionCard";
import { brand } from "@/lib/brand";
import type { ShopifyCollection } from "@/lib/shopify";

interface CollectionGridProps {
  collections: ShopifyCollection[];
}

export function CollectionGrid({ collections }: CollectionGridProps) {
  return (
    <Section>
      <Container wide>
        <ScrollReveal className="mb-10 sm:mb-[var(--space-2xl)]">
          <Caption className="mb-4 block sm:mb-6">{brand.collectionsCaption}</Caption>
          <H2>{brand.collectionsTitle}</H2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {collections.map((collection, i) => (
            <ScrollReveal
              key={collection.id}
              delay={i * 0.12}
              className={i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-1" : ""}
            >
              <CollectionCard collection={collection} index={i} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
