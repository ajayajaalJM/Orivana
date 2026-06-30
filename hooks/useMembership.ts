"use client";

import { useSession } from "next-auth/react";
import type { MemberTier } from "@/lib/membership-types";
import { getCartMode, isB2BTier } from "@/lib/membership";
import { getTierLabel } from "@/lib/membership-store";

export function useMembership() {
  const { data: session, status, update } = useSession();

  const tier: MemberTier | null = session?.user?.tier ?? null;
  const chefSupplyMode = session?.user?.chefSupplyMode ?? false;
  const isAuthenticated = status === "authenticated";
  const isB2B = tier ? isB2BTier(tier) : false;
  const cartMode = getCartMode(tier, chefSupplyMode);

  const toggleChefSupplyMode = async () => {
    if (tier !== "restaurant") return;
    const next = !chefSupplyMode;
    await fetch("/api/membership/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chefSupplyMode: next }),
    });
    await update({ chefSupplyMode: next });
  };

  return {
    session,
    status,
    tier,
    tierLabel: tier ? getTierLabel(tier) : null,
    businessName: session?.user?.businessName,
    chefSupplyMode,
    isAuthenticated,
    isB2B,
    cartMode,
    toggleChefSupplyMode,
  };
}
