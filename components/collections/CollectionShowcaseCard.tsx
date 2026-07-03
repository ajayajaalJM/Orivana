import Link from "next/link";
import { ImageBlock } from "@/components/ui/ImageBlock";

export interface CollectionShowcaseItem {
  handle: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface CollectionShowcaseCardProps {
  collection: CollectionShowcaseItem;
}

export function CollectionShowcaseCard({ collection }: CollectionShowcaseCardProps) {
  const isGift = collection.handle === "gift-collections";

  return (
    <Link href={`/collections/${collection.handle}`} className="group block h-full">
      <div className="relative overflow-hidden">
        <ImageBlock
          src={collection.imageUrl}
          alt={collection.title}
          aspectRatio="portrait"
          hoverZoom
          objectPosition={isGift ? "center 42%" : "center"}
        />
        <div className="pointer-events-none absolute inset-0 bg-[var(--color-overlay-warm)] transition-colors duration-700 group-hover:bg-[var(--color-olive)]/15" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101010]/65 via-[#101010]/25 to-transparent p-5 sm:p-8 lg:p-10">
          <h3 className="font-serif text-xl font-normal tracking-[0.02em] text-[var(--color-on-image)] sm:text-2xl lg:text-3xl">
            {collection.title}
          </h3>
          <p className="mt-2 max-w-md text-xs font-light leading-relaxed text-[var(--color-on-image)]/85 line-clamp-3 sm:mt-3 sm:text-sm sm:line-clamp-none">
            {collection.description}
          </p>
          <span className="mt-3 inline-block text-[10px] tracking-[0.22em] uppercase text-[var(--color-accent)] transition-opacity duration-500 group-hover:opacity-90 sm:mt-4 sm:tracking-[0.25em]">
            Enter Collection →
          </span>
        </div>
      </div>
    </Link>
  );
}
