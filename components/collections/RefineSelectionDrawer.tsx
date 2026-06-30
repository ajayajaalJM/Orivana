"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ShopifyProduct } from "@/lib/shopify";
import { REFINE_FILTER_GROUPS } from "@/lib/collections";
import { brand } from "@/lib/brand";

export interface RefineFilters {
  productType: string | null;
  origin: string | null;
  harvest: string | null;
  availability: string | null;
  giftReady: boolean | null;
  packaging: string | null;
}

const EMPTY_FILTERS: RefineFilters = {
  productType: null,
  origin: null,
  harvest: null,
  availability: null,
  giftReady: null,
  packaging: null,
};

interface RefineSelectionDrawerProps {
  products: ShopifyProduct[];
  filters: RefineFilters;
  onChange: (filters: RefineFilters) => void;
}

export function RefineSelectionDrawer({ products, filters, onChange }: RefineSelectionDrawerProps) {
  const [open, setOpen] = useState(false);

  const options = useMemo(() => {
    const unique = (values: (string | undefined)[]) =>
      [...new Set(values.filter(Boolean) as string[])].sort();

    return {
      productType: unique(products.map((p) => p.productType)),
      origin: unique(products.map((p) => p.origin)),
      harvest: unique(products.map((p) => p.harvest)),
      availability: unique(products.map((p) => p.availability)),
      packaging: unique(products.map((p) => p.packaging)),
    };
  }, [products]);

  const activeCount = Object.values(filters).filter((v) => v !== null).length;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-light tracking-[0.18em] uppercase text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
      >
        {brand.refineSelection}
        {activeCount > 0 && (
          <span className="ml-2 text-[var(--color-accent)]">({activeCount})</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-[var(--color-text)]/20 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={brand.refineSelection}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-sm flex-col border-l border-[var(--color-border)] bg-[var(--color-bg)] shadow-[-8px_0_32px_var(--color-shadow)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
                <h2 className="font-serif text-xl tracking-[0.04em]">{brand.refineSelection}</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs tracking-[0.2em] uppercase text-[var(--color-muted)]"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
                {REFINE_FILTER_GROUPS.map(({ key, label }) => {
                  const values = options[key as keyof typeof options];
                  if (!values?.length) return null;
                  return (
                    <FilterGroup
                      key={key}
                      label={label}
                      values={values}
                      selected={filters[key as keyof RefineFilters] as string | null}
                      onSelect={(value) =>
                        onChange({
                          ...filters,
                          [key]: filters[key as keyof RefineFilters] === value ? null : value,
                        })
                      }
                    />
                  );
                })}

                <FilterGroup
                  label="Gift Ready"
                  values={["Yes"]}
                  selected={filters.giftReady === true ? "Yes" : null}
                  onSelect={() =>
                    onChange({
                      ...filters,
                      giftReady: filters.giftReady ? null : true,
                    })
                  }
                />
              </div>

              <div className="border-t border-[var(--color-border)] px-6 py-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => onChange(EMPTY_FILTERS)}
                  className="text-xs tracking-[0.15em] uppercase text-[var(--color-muted)] hover:text-[var(--color-text)]"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="ml-auto text-xs tracking-[0.15em] uppercase text-[var(--color-olive)]"
                >
                  View Selections
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterGroup({
  label,
  values,
  selected,
  onSelect,
}: {
  label: string;
  values: string[];
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-4 text-[10px] tracking-[0.2em] uppercase text-[var(--color-muted)]">
        {label}
      </p>
      <ul className="space-y-3">
        {values.map((value) => (
          <li key={value}>
            <button
              type="button"
              onClick={() => onSelect(value)}
              className={`text-sm font-light transition-colors ${
                selected === value
                  ? "text-[var(--color-olive)]"
                  : "text-[var(--color-text-soft)] hover:text-[var(--color-text)]"
              }`}
            >
              {value}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function applyRefineFilters(
  products: ShopifyProduct[],
  filters: RefineFilters
): ShopifyProduct[] {
  return products.filter((product) => {
    if (filters.productType && product.productType !== filters.productType) return false;
    if (filters.origin && product.origin !== filters.origin) return false;
    if (filters.harvest && product.harvest !== filters.harvest) return false;
    if (filters.availability && product.availability !== filters.availability) return false;
    if (filters.packaging && product.packaging !== filters.packaging) return false;
    if (filters.giftReady && !product.giftReady) return false;
    return true;
  });
}

export { EMPTY_FILTERS };
