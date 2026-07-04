import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: brand.harvestCircleJoin,
  description: brand.tiers.individual.description,
  path: "/membership/join",
  noIndex: true,
});

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
