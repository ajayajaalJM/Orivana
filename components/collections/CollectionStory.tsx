import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Excerpt, H2, Caption } from "@/components/ui/Typography";
import type { CollectionEditorial } from "@/lib/collections";

interface CollectionStoryProps {
  editorial: CollectionEditorial;
}

export function CollectionStory({ editorial }: CollectionStoryProps) {
  return (
    <Section>
      <Container wide>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,2fr)] lg:items-start lg:gap-14">
          <div className="lg:pt-2">
            <Caption className="mb-3 block sm:mb-4">The Story</Caption>
            <H2 className="text-[clamp(1.625rem,4.5vw,2.25rem)] leading-[1.2]">
              {editorial.story.title}
            </H2>
          </div>

          <div
            aria-hidden
            className="hidden h-full min-h-[120px] w-px bg-gradient-to-b from-transparent via-[var(--color-border)] to-transparent lg:block"
          />

          <div className="space-y-6 lg:pt-2 lg:space-y-7">
            {editorial.story.paragraphs.map((paragraph, i) => (
              <Excerpt key={i} className="text-left">
                {paragraph}
              </Excerpt>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
