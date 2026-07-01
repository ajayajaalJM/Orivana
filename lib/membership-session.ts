import type { Session } from "next-auth";
import type { ApplicationStatus, MemberTier } from "./membership-types";
import { getSession } from "./auth";
import {
  getCustomerAccountProfile,
  isCustomerAccountAuthenticated,
  type CustomerAccountProfile,
} from "./shopify/customer-account/customer";
import { isCustomerAccountConfigured } from "./shopify/customer-account/config";

export interface InnerCircleSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    tier?: MemberTier;
    applicationStatus?: ApplicationStatus;
    businessName?: string;
    chefSupplyMode?: boolean;
  };
  source: "customer-account" | "nextauth";
}

function profileToSession(profile: CustomerAccountProfile): InnerCircleSession {
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.email;
  const { metafields } = profile;

  return {
    source: "customer-account",
    user: {
      id: profile.id,
      name,
      email: profile.email,
      tier: metafields.membershipTier ?? "individual",
      applicationStatus: metafields.applicationStatus ?? "approved",
      businessName: metafields.businessName,
      chefSupplyMode: metafields.chefSupplyMode ?? false,
    },
  };
}

function nextAuthToInnerCircle(session: Session): InnerCircleSession {
  return {
    source: "nextauth",
    user: {
      id: session.user?.id ?? "",
      name: session.user?.name,
      email: session.user?.email,
      tier: session.user?.tier,
      applicationStatus: session.user?.applicationStatus,
      businessName: session.user?.businessName,
      chefSupplyMode: session.user?.chefSupplyMode,
    },
  };
}

/** Resolve Inner Circle session from Customer Account API (preferred) or NextAuth (demo fallback). */
export async function getInnerCircleSession(): Promise<InnerCircleSession | null> {
  if (isCustomerAccountConfigured() && (await isCustomerAccountAuthenticated())) {
    const profile = await getCustomerAccountProfile();
    if (!profile) return null;

    if (profile.metafields.applicationStatus === "pending") {
      return null;
    }

    return profileToSession(profile);
  }

  const nextAuth = await getSession();
  if (!nextAuth?.user) return null;

  if (nextAuth.user.applicationStatus === "pending") {
    return null;
  }

  return nextAuthToInnerCircle(nextAuth);
}

export async function getInnerCircleSessionOrPending(): Promise<{
  session: InnerCircleSession | null;
  pending: boolean;
}> {
  if (isCustomerAccountConfigured() && (await isCustomerAccountAuthenticated())) {
    const profile = await getCustomerAccountProfile();
    if (!profile) return { session: null, pending: false };
    if (profile.metafields.applicationStatus === "pending") {
      return { session: null, pending: true };
    }
    return { session: profileToSession(profile), pending: false };
  }

  const nextAuth = await getSession();
  if (!nextAuth?.user) return { session: null, pending: false };
  if (nextAuth.user.applicationStatus === "pending") {
    return { session: null, pending: true };
  }
  return { session: nextAuthToInnerCircle(nextAuth), pending: false };
}
