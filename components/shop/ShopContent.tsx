"use client";

import { useMemo, useState } from "react";
import { CollectionSelectionGrid } from "@/components/collections/CollectionSelectionGrid";
import {
  RefineSelectionDrawer,
  applyRefineFilters,
  EMPTY_FILTERS,
  type RefineFilters,
} from "@/components/collections/RefineSelectionDrawer";
import { productMatchesCollection, type ShopifyProduct } from "@/lib/shopify";

interface ShopContentProps {
  products: ShopifyProduct[];
}

export function ShopContent({ products }: ShopContentProps) {
  const [filters, setFilters] = useState<RefineFilters>(EMPTY_FILTERS);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCollection) {
      result = result.filter((p) => productMatchesCollection(p, activeCollection));
    }
    return applyRefineFilters(result, filters);
  }, [products, activeCollection, filters]);

  const collectionTabs = [
    { handle: null, label: "All Selections" },
    { handle: "dates", label: "Dates" },
    { handle: "olive-oil", label: "Olive Oil" },
    { handle: "honey", label: "Honey" },
    { handle: "gift-collections", label: "Gifts" },
  ];

  return (
    <>
      <div className="mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-center md:justify-between">
        <div
          className="flex flex-wrap gap-x-6 gap-y-3"
          role="group"
          aria-label="Browse by collection"
        >
          {collectionTabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveCollection(tab.handle)}
              className={`min-h-[44px] text-xs font-light tracking-[0.14em] uppercase transition-colors duration-500 sm:tracking-[0.18em] ${
                activeCollection === tab.handle
                  ? "border-b border-[var(--color-accent)] pb-1 text-[var(--color-olive)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
              aria-pressed={activeCollection === tab.handle}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <RefineSelectionDrawer
          products={products}
          filters={filters}
          onChange={setFilters}
        />
      </div>

      <CollectionSelectionGrid products={filteredProducts} />
    </>
  );
}
