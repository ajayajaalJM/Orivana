import type { DefaultSession } from "next-auth";
import type { ApplicationStatus, MemberTier } from "@/lib/membership-types";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      tier?: MemberTier;
      applicationStatus?: ApplicationStatus;
      businessName?: string;
      chefSupplyMode?: boolean;
    };
  }

  interface User {
    id: string;
    tier?: MemberTier;
    applicationStatus?: ApplicationStatus;
    businessName?: string;
    chefSupplyMode?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    tier?: MemberTier;
    applicationStatus?: ApplicationStatus;
    businessName?: string;
    chefSupplyMode?: boolean;
  }
}
