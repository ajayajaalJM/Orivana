interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled?: boolean;
  min?: number;
}

export function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  disabled = false,
  min = 1,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={disabled || quantity <= min}
        onClick={onDecrease}
        className="flex h-8 w-8 items-center justify-center border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-text)]/30 hover:text-[var(--color-text)] disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-[1.5rem] text-center text-sm text-[var(--color-text)]">{quantity}</span>
      <button
        type="button"
        disabled={disabled}
        onClick={onIncrease}
        className="flex h-8 w-8 items-center justify-center border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-text)]/30 hover:text-[var(--color-text)] disabled:opacity-40"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
