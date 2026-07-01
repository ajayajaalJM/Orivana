import { formatPrice, type ShopifyMoney } from "@/lib/shopify";
import { Price } from "@/components/ui/Typography";

interface PriceDisplayProps {
  money: ShopifyMoney;
  className?: string;
  compareAt?: ShopifyMoney | null;
}

export function PriceDisplay({ money, className, compareAt }: PriceDisplayProps) {
  return (
    <Price className={className}>
      {formatPrice(money)}
      {compareAt && parseFloat(compareAt.amount) > parseFloat(money.amount) && (
        <span className="ml-2 text-xs font-light text-[var(--color-muted)] line-through">
          {formatPrice(compareAt)}
        </span>
      )}
    </Price>
  );
}
