import Link from "next/link";
import { ImageBlock } from "@/components/ui/ImageBlock";
import type { ShopifyCollection } from "@/lib/shopify";

interface CollectionCardProps {
  collection: ShopifyCollection;
  index?: number;
  featured?: boolean;
}

export function CollectionCard({ collection, index = 0, featured }: CollectionCardProps) {
  const isFeatured = featured ?? index === 0;

  return (
    <Link href={`/collections/${collection.handle}`} className="group block">
      <div className="relative overflow-hidden">
        <ImageBlock
          src={collection.image?.url ?? ""}
          alt={collection.title}
          aspectRatio={isFeatured ? "landscape" : "portrait"}
          hoverZoom
        />
        <div className="absolute inset-0 bg-[var(--color-overlay-warm)] transition-colors duration-500 group-hover:bg-[var(--color-olive)]/20 md:bg-transparent md:group-hover:bg-[var(--color-olive)]/10" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101010]/55 to-transparent p-6 sm:p-8 md:p-10">
          <h3 className="break-words font-serif text-xl font-normal tracking-[0.01em] text-[var(--color-on-image)] sm:text-2xl md:text-3xl">
            {collection.title}
          </h3>
          {collection.description && (
            <p className="mt-2 line-clamp-2 text-xs font-light text-[var(--color-on-image)]/80 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
              {collection.description}
            </p>
          )}
          <span className="mt-2 inline-block text-[10px] tracking-[0.25em] uppercase text-[var(--color-accent)] opacity-100 transition-all duration-500 md:mt-3 md:opacity-0 md:group-hover:opacity-100">
            Enter Collection
          </span>
        </div>
      </div>
    </Link>
  );
}
