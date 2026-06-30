"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { H2, Caption } from "@/components/ui/Typography";
import { ImageBlock } from "@/components/ui/ImageBlock";
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
              <Link href={`/collections/${collection.handle}`} className="group block">
                <div className="relative overflow-hidden">
                  <ImageBlock
                    src={collection.image?.url ?? ""}
                    alt={collection.title}
                    aspectRatio={i === 0 ? "landscape" : "portrait"}
                    hoverZoom
                  />
                  <div className="absolute inset-0 bg-[var(--color-overlay-warm)] transition-colors duration-500 group-hover:bg-[var(--color-olive)]/20 md:bg-transparent md:group-hover:bg-[var(--color-olive)]/10" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101010]/55 to-transparent p-6 sm:p-8 md:p-10">
                    <h3 className="break-words font-serif text-xl font-normal tracking-[0.01em] text-[var(--color-on-image)] sm:text-2xl md:text-3xl">
                      {collection.title}
                    </h3>
                    <span className="mt-2 inline-block text-[10px] tracking-[0.25em] uppercase text-[var(--color-accent)] opacity-100 transition-all duration-500 md:mt-3 md:opacity-0 md:group-hover:opacity-100">
                      Enter Collection
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
