"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Caption, H2 } from "@/components/ui/Typography";
import { CollectionSelectionGrid } from "@/components/collections/CollectionSelectionGrid";
import {
  RefineSelectionDrawer,
  applyRefineFilters,
  EMPTY_FILTERS,
  type RefineFilters,
} from "@/components/collections/RefineSelectionDrawer";
import type { ShopifyProduct } from "@/lib/shopify";

interface CollectionProductSectionProps {
  products: ShopifyProduct[];
  collectionTitle: string;
}

export function CollectionProductSection({
  products,
  collectionTitle,
}: CollectionProductSectionProps) {
  const [filters, setFilters] = useState<RefineFilters>(EMPTY_FILTERS);

  const filtered = useMemo(
    () => applyRefineFilters(products, filters),
    [products, filters]
  );

  const selectionLabel =
    filtered.length === 1 ? "One expression within this collection" : `${filtered.length} expressions within this collection`;

  return (
    <Section className="border-t border-[var(--color-border)]/50 bg-[var(--color-surface-alt)]/35">
      <Container wide>
        <div className="mb-8 flex flex-col gap-5 border-b border-[var(--color-border)]/40 pb-8 sm:mb-16 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:pb-10">
          <div className="max-w-2xl">
            <Caption className="mb-3 block sm:mb-4">The Selection</Caption>
            <H2 className="text-[clamp(1.625rem,5vw,2.5rem)] leading-[1.15]">
              Within {collectionTitle}
            </H2>
            <p className="mt-3 text-sm font-light leading-relaxed text-[var(--color-muted)] sm:mt-4">
              {selectionLabel} — each harvest presented in its available sizes and expressions.
            </p>
          </div>
          <div className="flex shrink-0 justify-end sm:justify-start">
            <RefineSelectionDrawer products={products} filters={filters} onChange={setFilters} />
          </div>
        </div>

        <CollectionSelectionGrid products={filtered} />
      </Container>
    </Section>
  );
}
