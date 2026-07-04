import type { Metadata } from "next";
import { ApplicationForm } from "@/components/membership/ApplicationForm";
import { brand } from "@/lib/brand";
import { createPageMetadata } from "@/lib/metadata";

interface Props {
  params: Promise<{ tier: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tier } = await params;
  const tierKey = tier as keyof typeof brand.tiers;
  const copy = brand.tiers[tierKey];
  return createPageMetadata({
    title: copy ? `${copy.tagline} — ${brand.harvestCircle}` : brand.harvestCircle,
    description: copy?.description ?? brand.harvestCircleDescription,
    path: `/membership/apply/${tier}`,
    noIndex: true,
  });
}

export default async function ApplyPage({ params }: Props) {
  const { tier } = await params;

  if (tier !== "restaurant" && tier !== "wholesale") {
    return null;
  }

  return <ApplicationForm tier={tier} />;
}
