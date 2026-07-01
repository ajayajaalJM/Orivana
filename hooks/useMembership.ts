"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { MemberTier, ApplicationStatus } from "@/lib/membership-types";
import { getCartMode, isB2BTier } from "@/lib/membership";
import { getTierLabel } from "@/lib/membership-store";

interface CustomerAccountSessionUser {
  id: string;
  name?: string;
  email?: string;
  tier?: MemberTier;
  applicationStatus?: ApplicationStatus;
  businessName?: string;
  chefSupplyMode?: boolean;
}

export function useMembership() {
  const { data: nextAuthSession, status, update } = useSession();
  const [caUser, setCaUser] = useState<CustomerAccountSessionUser | null>(null);
  const [caLoaded, setCaLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/customer/account/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.session?.user) {
          setCaUser(data.session.user);
        } else {
          setCaUser(null);
        }
      })
      .catch(() => setCaUser(null))
      .finally(() => setCaLoaded(true));
  }, []);

  const user = caUser ?? nextAuthSession?.user ?? null;
  const tier: MemberTier | null = user?.tier ?? null;
  const chefSupplyMode = user?.chefSupplyMode ?? false;
  const isAuthenticated = Boolean(caUser) || status === "authenticated";
  const isB2B = tier ? isB2BTier(tier) : false;
  const cartMode = getCartMode(tier, chefSupplyMode);
  const authSource = caUser ? ("customer-account" as const) : nextAuthSession ? ("nextauth" as const) : null;

  const toggleChefSupplyMode = async () => {
    if (tier !== "restaurant") return;
    const next = !chefSupplyMode;
    if (authSource === "nextauth") {
      await fetch("/api/membership/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chefSupplyMode: next }),
      });
      await update({ chefSupplyMode: next });
    }
    setCaUser((prev) => (prev ? { ...prev, chefSupplyMode: next } : prev));
  };

  return {
    session: caUser ? { user: caUser } : nextAuthSession,
    status: caLoaded ? (isAuthenticated ? "authenticated" : "unauthenticated") : status,
    tier,
    tierLabel: tier ? getTierLabel(tier) : null,
    businessName: user?.businessName,
    chefSupplyMode,
    isAuthenticated,
    isB2B,
    cartMode,
    authSource,
    toggleChefSupplyMode,
  };
}
