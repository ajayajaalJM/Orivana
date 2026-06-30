"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/Button";
import { Caption, Excerpt, H2 } from "@/components/ui/Typography";
import { HarvestMarket } from "@/components/membership/HarvestMarket";
import { BulkOrderTool } from "@/components/membership/BulkOrderTool";
import { ReorderCenter } from "@/components/membership/ReorderCenter";
import { useMembership } from "@/hooks/useMembership";
import { brand } from "@/lib/brand";
import { filterProductsForTier, getProductVisibility } from "@/lib/membership";
import { getTierLabel } from "@/lib/membership-store";
import type { MemberOrder } from "@/lib/membership-types";
import type { ShopifyProduct } from "@/lib/shopify";

type DashboardTab = "overview" | "market" | "bulk" | "reorder" | "exclusive" | "profile";

interface InnerCircleDashboardProps {
  session: Session;
  orders: MemberOrder[];
  products: ShopifyProduct[];
}

const tabs: { id: DashboardTab; label: string; b2bOnly?: boolean }[] = [
  { id: "overview", label: "Overview" },
  { id: "market", label: brand.harvestMarket },
  { id: "bulk", label: brand.bulkOrderTool, b2bOnly: true },
  { id: "reorder", label: brand.previousSelections },
  { id: "exclusive", label: brand.exclusiveHarvests },
  { id: "profile", label: brand.innerCircleProfile },
];

export function InnerCircleDashboard({ session, orders, products }: InnerCircleDashboardProps) {
  const { tier, isB2B, chefSupplyMode, toggleChefSupplyMode } = useMembership();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  const exclusiveProducts = products.filter(
    (p) => getProductVisibility(p) !== "public"
  );
  const accessibleExclusive = filterProductsForTier(exclusiveProducts, tier ?? null);
  const featured = products.find((p) => p.tags.includes("featured")) ?? products[0];

  const visibleTabs = tabs.filter((t) => !t.b2bOnly || isB2B);

  return (
    <div>
      <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-12 md:flex-row md:items-end">
        <div className="min-w-0">
          <Caption className="mb-2 block">{brand.innerCircleHub}</Caption>
          <H2 as="h1" className="page-title">
            Welcome, {session.user?.name ?? "Member"}
          </H2>
          {tier && (
            <p className="mt-3 font-serif text-lg text-[var(--color-accent)]">
              {getTierLabel(tier)}
              {session.user?.businessName && (
                <span className="ml-2 text-sm font-sans font-light text-[var(--color-muted)]">
                  — {session.user.businessName}
                </span>
              )}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/membership" })}
          className="shrink-0 text-xs tracking-[0.2em] uppercase text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          Sign Out
        </button>
      </div>

      <nav
        className="mb-10 flex gap-x-6 gap-y-3 overflow-x-auto border-b border-[var(--color-border)] pb-4"
        aria-label="Inner Circle sections"
      >
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 text-xs font-light tracking-[0.14em] uppercase transition-colors sm:tracking-[0.18em] ${
              activeTab === tab.id
                ? "border-b border-[var(--color-accent)] pb-1 text-[var(--color-olive)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <section className="card-surface border border-[var(--color-border)] p-6 sm:p-8">
            <Caption className="mb-4 block">Membership Status</Caption>
            <H2 className="!text-xl mb-4">{tier ? getTierLabel(tier) : "Guest"}</H2>
            <Excerpt>
              {tier === "individual" && brand.tiers.individual.description}
              {tier === "restaurant" && brand.tiers.restaurant.description}
              {tier === "wholesale" && brand.tiers.wholesale.description}
            </Excerpt>
            {tier === "restaurant" && (
              <label className="mt-8 flex cursor-pointer items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6">
                <div>
                  <p className="font-serif text-base text-[var(--color-text)]">{brand.chefSupplyMode}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">
                    {brand.chefSupplyModeDescription}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={chefSupplyMode}
                  onClick={toggleChefSupplyMode}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                    chefSupplyMode ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-[var(--color-bg)] transition-transform ${
                      chefSupplyMode ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </label>
            )}
          </section>

          {featured && (
            <section className="card-surface border border-[var(--color-border)] p-6 sm:p-8">
              <Caption className="mb-4 block">Featured Seasonal Harvest</Caption>
              <H2 className="!text-xl mb-3">{featured.title}</H2>
              <Excerpt className="mb-6">{featured.description}</Excerpt>
              <Link href={`/product/${featured.handle}`}>
                <Button variant="secondary">View Harvest</Button>
              </Link>
            </section>
          )}
        </div>
      )}

      {activeTab === "market" && <HarvestMarket products={products} />}

      {activeTab === "bulk" && isB2B && <BulkOrderTool products={products} />}

      {activeTab === "reorder" && <ReorderCenter orders={orders} products={products} />}

      {activeTab === "exclusive" && (
        <div>
          {accessibleExclusive.length > 0 ? (
            <HarvestMarket products={exclusiveProducts} />
          ) : (
            <Excerpt className="py-12 text-center">
              Exclusive harvests are reserved for Inner Circle members. Upgrade your access to unlock
              private allocations.
            </Excerpt>
          )}
        </div>
      )}

      {activeTab === "profile" && (
        <section className="mx-auto max-w-lg card-surface border border-[var(--color-border)] p-6 sm:p-8">
          <Caption className="mb-6 block">{brand.innerCircleProfile}</Caption>
          <dl className="space-y-6">
            <ProfileField label="Name" value={session.user?.name ?? "—"} />
            <ProfileField label="Email" value={session.user?.email ?? "—"} />
            <ProfileField label="Tier" value={tier ? getTierLabel(tier) : "—"} />
            {session.user?.businessName && (
              <ProfileField label="Business" value={session.user.businessName} />
            )}
          </dl>
          <div className="mt-10 border-t border-[var(--color-border)] pt-8">
            <Link href="/shop">
              <Button variant="secondary" fullWidthMobile className="w-full sm:w-auto">
                Browse Public Collection
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.18em] uppercase text-[var(--color-muted)]">{label}</dt>
      <dd className="mt-1 font-serif text-lg text-[var(--color-text)]">{value}</dd>
    </div>
  );
}
