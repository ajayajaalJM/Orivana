import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Caption, Excerpt, H1 } from "@/components/ui/Typography";
import type { CollectionEditorial } from "@/lib/collections";

interface CollectionHeroProps {
  editorial: CollectionEditorial;
}

export function CollectionHero({ editorial }: CollectionHeroProps) {
  return (
    <section className="relative min-h-[72vh] w-full overflow-hidden">
      <Image
        src={editorial.heroImage}
        alt={editorial.title}
        fill
        priority
        sizes="100vw"
        className="object-cover img-editorial"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-overlay)]/35 via-[var(--color-overlay)] to-[var(--color-overlay)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />

      <div className="absolute inset-0 flex items-end">
        <Container className="relative z-10 pb-14 pt-[var(--nav-height)] sm:pb-20">
          <Caption className="mb-5 block text-[var(--color-on-image)]/80">Collection</Caption>
          <H1 className="page-title max-w-3xl text-[var(--color-on-image)]">{editorial.title}</H1>
          <Excerpt className="mt-6 max-w-xl text-[var(--color-on-image)]/88">
            {editorial.heroIntro}
          </Excerpt>
        </Container>
      </div>
    </section>
  );
}
