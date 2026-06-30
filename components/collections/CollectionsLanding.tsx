"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { H2, Excerpt, Caption } from "@/components/ui/Typography";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { brand } from "@/lib/brand";
import { PERMANENT_COLLECTIONS } from "@/lib/collections";

export function CollectionsLanding() {
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
            {PERMANENT_COLLECTIONS.map((collection, i) => (
              <ScrollReveal key={collection.handle} delay={i * 0.1}>
                <Link href={`/collections/${collection.handle}`} className="group block">
                  <div className="relative overflow-hidden">
                    <ImageBlock
                      src={collection.gridImage}
                      alt={collection.title}
                      aspectRatio={i === 3 ? "landscape" : "portrait"}
                      hoverZoom
                    />
                    <div className="absolute inset-0 bg-[var(--color-overlay-warm)] transition-colors duration-700 group-hover:bg-[var(--color-olive)]/15" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101010]/60 to-transparent p-8 sm:p-10">
                      <h3 className="font-serif text-2xl text-[var(--color-on-image)] sm:text-3xl">
                        {collection.title}
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-on-image)]/85">
                        {collection.heroIntro}
                      </p>
                      <span className="mt-4 inline-block text-[10px] tracking-[0.25em] uppercase text-[var(--color-accent)]">
                        Enter Collection →
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
