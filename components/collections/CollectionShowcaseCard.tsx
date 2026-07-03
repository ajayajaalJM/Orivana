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
      <div className="relative aspect-[3/4] overflow-hidden">
        <ImageBlock
          src={collection.imageUrl}
          alt={collection.title}
          fill
          hoverZoom
          objectPosition={isGift ? "center 42%" : "center"}
        />
        <div className="absolute inset-0 bg-[var(--color-overlay-warm)] transition-colors duration-700 group-hover:bg-[var(--color-olive)]/15" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101010]/65 via-[#101010]/25 to-transparent p-8 sm:p-10">
          <h3 className="font-serif text-2xl font-normal tracking-[0.02em] text-[var(--color-on-image)] sm:text-3xl">
            {collection.title}
          </h3>
          <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-[var(--color-on-image)]/85">
            {collection.description}
          </p>
          <span className="mt-4 inline-block text-[10px] tracking-[0.25em] uppercase text-[var(--color-accent)] transition-opacity duration-500 group-hover:opacity-90">
            Enter Collection →
          </span>
        </div>
      </div>
    </Link>
  );
}
