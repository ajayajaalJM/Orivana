import type { Metadata } from "next";
import { Suspense } from "react";
import { brand } from "@/lib/brand";
import { createPageMetadata } from "@/lib/metadata";
import MemberLoginPage from "./LoginContent";

export const metadata: Metadata = createPageMetadata({
  title: brand.innerCircleLogin,
  description: `Sign in to ${brand.harvestCircle} — ${brand.harvestCircleDescription}`,
  path: "/membership/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-[var(--color-muted)]">
          Loading...
        </div>
      }
    >
      <MemberLoginPage />
    </Suspense>
  );
}
