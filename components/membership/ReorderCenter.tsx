"use client";

import { AddToHarvestButton } from "@/components/cart/AddToHarvestButton";
import { Button } from "@/components/ui/Button";
import { Caption, Excerpt } from "@/components/ui/Typography";
import { useMembership } from "@/hooks/useMembership";
import { brand } from "@/lib/brand";
import type { MemberOrder } from "@/lib/membership-types";
import type { ShopifyProduct } from "@/lib/shopify";

interface ReorderCenterProps {
  orders: MemberOrder[];
  products: ShopifyProduct[];
}

export function ReorderCenter({ orders, products }: ReorderCenterProps) {
  const { tier, isB2B } = useMembership();

  if (orders.length === 0) {
    return (
      <Excerpt className="py-8 text-center">
        No previous orders to reorder. Explore the harvest market to begin.
      </Excerpt>
    );
  }

  const productByTitle = new Map(products.map((p) => [p.title, p]));
  const lastOrder = orders[0];

  return (
    <div className="space-y-8">
      {isB2B && lastOrder && (
        <div className="card-surface border border-[var(--color-accent)]/30 p-5 sm:p-6">
          <Caption className="mb-3 block">{brand.reorderLastSupply}</Caption>
          <p className="font-serif text-lg text-[var(--color-text)]">{lastOrder.id}</p>
          <Caption className="mt-1 block">{lastOrder.date}</Caption>
          <ul className="mt-4 space-y-2">
            {lastOrder.items.map((item, i) => {
              const product = productByTitle.get(item.title);
              const variant = product?.variants[0];
              return (
                <li
                  key={i}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm text-[var(--color-muted)]">
                    {item.title} × {item.quantity}
                    {item.unit && ` (${item.unit})`}
                  </span>
                  {variant && (
                    <AddToHarvestButton
                      variantId={variant.id}
                      quantity={item.quantity}
                      compact
                      label="Reorder"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="card-surface border border-[var(--color-border)] p-5 sm:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <div>
                <p className="font-serif text-lg text-[var(--color-text)]">{order.id}</p>
                <Caption className="mt-1 block">{order.date}</Caption>
              </div>
              <div className="sm:text-right">
                <p className="text-[var(--color-accent)]">{order.total}</p>
                <Caption className="mt-1 block">{order.status}</Caption>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {order.items.map((item, i) => (
                <li key={i} className="text-sm text-[var(--color-muted)]">
                  {item.title} × {item.quantity}
                  {item.unit && ` (${item.unit})`}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {tier === "wholesale" && (
        <div className="flex flex-wrap gap-4 pt-4">
          <Button variant="secondary">{brand.requestPricingSheet}</Button>
          <Button variant="ghost">{brand.downloadCatalog}</Button>
          <Button variant="ghost">{brand.accountManagerRequest}</Button>
        </div>
      )}
    </div>
  );
}
