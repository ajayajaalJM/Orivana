import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Excerpt, H1 } from "@/components/ui/Typography";
import type { CollectionEditorial } from "@/lib/collections";

interface CollectionHeroProps {
  editorial: CollectionEditorial;
}

export function CollectionHero({ editorial }: CollectionHeroProps) {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">
      <Image
        src={editorial.heroImage}
        alt={editorial.title}
        fill
        priority
        sizes="100vw"
        className="object-cover img-editorial"
      />
      <div className="absolute inset-0 bg-[var(--color-overlay)]" />
      <div className="absolute inset-0 flex items-end">
        <Container className="relative z-10 pb-16 pt-[var(--nav-height)] sm:pb-24">
          <H1 className="page-title max-w-3xl text-[var(--color-on-image)]">
            {editorial.title}
          </H1>
          <Excerpt className="mt-6 max-w-xl text-[var(--color-on-image)]/90">
            {editorial.heroIntro}
          </Excerpt>
        </Container>
      </div>
    </section>
  );
}
