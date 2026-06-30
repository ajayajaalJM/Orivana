import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Excerpt, H2 } from "@/components/ui/Typography";
import type { CollectionEditorial } from "@/lib/collections";

interface CollectionStoryProps {
  editorial: CollectionEditorial;
}

export function CollectionStory({ editorial }: CollectionStoryProps) {
  return (
    <Section dark>
      <Container wide>
        <div className="mx-auto max-w-3xl text-center">
          <H2 className="mb-10 sm:mb-14">{editorial.story.title}</H2>
          <div className="space-y-8">
            {editorial.story.paragraphs.map((paragraph, i) => (
              <Excerpt key={i}>{paragraph}</Excerpt>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
