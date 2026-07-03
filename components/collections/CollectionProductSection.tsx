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
        <div className="mb-12 flex flex-col gap-8 border-b border-[var(--color-border)]/40 pb-10 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Caption className="mb-4 block">The Selection</Caption>
            <H2 className="text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15]">
              Within {collectionTitle}
            </H2>
            <p className="mt-4 text-sm font-light leading-relaxed text-[var(--color-muted)]">
              {selectionLabel} — each harvest presented in its available sizes and expressions.
            </p>
          </div>
          <RefineSelectionDrawer products={products} filters={filters} onChange={setFilters} />
        </div>

        <CollectionSelectionGrid products={filtered} />
      </Container>
    </Section>
  );
}
