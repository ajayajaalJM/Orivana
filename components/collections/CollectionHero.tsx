import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Caption, Excerpt, H1 } from "@/components/ui/Typography";
import type { CollectionEditorial } from "@/lib/collections";

interface CollectionHeroProps {
  editorial: CollectionEditorial;
}

export function CollectionHero({ editorial }: CollectionHeroProps) {
  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden sm:min-h-[72vh]">
      <Image
        src={editorial.heroImage}
        alt={editorial.title}
        fill
        priority
        sizes="100vw"
        className="object-cover img-editorial"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-overlay)]/35 via-[var(--color-overlay)] to-[var(--color-overlay)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-bg)] to-transparent sm:h-32" />

      <div className="absolute inset-0 flex items-end">
        <Container className="content-below-nav relative z-10 pb-10 sm:pb-20">
          <Caption className="mb-4 block text-[var(--color-on-image)]/80 sm:mb-5">Collection</Caption>
          <H1 className="page-title max-w-3xl text-[var(--color-on-image)]">{editorial.title}</H1>
          <Excerpt className="mt-4 max-w-xl text-[var(--color-on-image)]/88 sm:mt-6">
            {editorial.heroIntro}
          </Excerpt>
        </Container>
      </div>
    </section>
  );
}
