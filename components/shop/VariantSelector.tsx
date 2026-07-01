import type { ShopifyVariant } from "@/lib/shopify";

interface VariantSelectorProps {
  variants: ShopifyVariant[];
  selectedVariant: ShopifyVariant;
  onSelect: (variant: ShopifyVariant) => void;
  className?: string;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
  className = "",
}: VariantSelectorProps) {
  if (variants.length <= 1) return null;

  return (
    <div className={`flex flex-wrap gap-3 sm:gap-4 ${className}`}>
      {variants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          onClick={() => onSelect(variant)}
          disabled={!variant.availableForSale}
          className={`min-h-[44px] px-0 py-2 text-xs font-light tracking-[0.2em] uppercase transition-colors duration-500 disabled:opacity-40 ${
            selectedVariant?.id === variant.id
              ? "border-b border-[var(--color-text)] text-[var(--color-text)]"
              : "text-[var(--color-muted)]"
          }`}
        >
          {variant.title}
          {variant.quantityAvailable != null && variant.quantityAvailable <= 5 && variant.availableForSale && (
            <span className="ml-2 text-[9px] tracking-wider text-[var(--color-olive)]">
              ({variant.quantityAvailable} left)
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
