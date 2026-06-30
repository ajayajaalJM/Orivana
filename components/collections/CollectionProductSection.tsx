"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
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
}

export function CollectionProductSection({ products }: CollectionProductSectionProps) {
  const [filters, setFilters] = useState<RefineFilters>(EMPTY_FILTERS);

  const filtered = useMemo(
    () => applyRefineFilters(products, filters),
    [products, filters]
  );

  return (
    <Section>
      <Container wide>
        <div className="mb-10 flex items-center justify-end sm:mb-14">
          <RefineSelectionDrawer
            products={products}
            filters={filters}
            onChange={setFilters}
          />
        </div>
        <CollectionSelectionGrid products={filtered} />
      </Container>
    </Section>
  );
}
