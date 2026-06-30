"use client";

import { TextLink } from "@/components/ui/TextLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { H2, Excerpt } from "@/components/ui/Typography";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { getBrandStoryImageUrl } from "@/lib/sanity";

interface BrandStoryProps {
  title: string;
  body: string;
  ctaText: string;
}

export function BrandStory({ title, body, ctaText }: BrandStoryProps) {
  const imageUrl = getBrandStoryImageUrl();
  const paragraphs = body.split("\n\n");

  return (
    <Section dark>
      <Container wide>
        <div className="grid grid-cols-1 items-stretch gap-10 sm:gap-16 lg:grid-cols-2 lg:gap-[var(--space-2xl)]">
          <ScrollReveal className="order-2 lg:order-1">
            <div className="relative overflow-hidden">
              <ImageBlock
                src={imageUrl}
                alt={title}
                aspectRatio="portrait"
                parallax
              />
              <div className="pointer-events-none absolute inset-0 bg-[var(--color-overlay-warm)]" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="order-1 flex flex-col justify-center lg:order-2">
            <div className="flex flex-col gap-6 sm:gap-[var(--space-xl)] lg:pl-[var(--space-xl)]">
              <H2>{title}</H2>
              <div className="space-y-[var(--space-lg)]">
                {paragraphs.map((p, i) => (
                  <Excerpt key={i} className="max-w-md">
                    {p}
                  </Excerpt>
                ))}
              </div>
              <div className="pt-[var(--space-md)]">
                <TextLink href="/story">{ctaText} →</TextLink>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </Section>
  );
}
