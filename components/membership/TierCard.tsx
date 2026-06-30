"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Caption, Excerpt, H3 } from "@/components/ui/Typography";
import type { MemberTier } from "@/lib/membership-types";

interface TierCardProps {
  tier: MemberTier;
  name: string;
  tagline: string;
  description: string;
  access: readonly string[];
  cta: string;
  href: string;
}

export function TierCard({
  tier,
  name,
  tagline,
  description,
  access,
  cta,
  href,
}: TierCardProps) {
  return (
    <article className="card-surface flex flex-col border border-[var(--color-border)] p-6 sm:p-8">
      <Caption className="mb-4 block">{tagline}</Caption>
      <H3 className="mb-4 !text-2xl">{name}</H3>
      <Excerpt className="mb-8 flex-1">{description}</Excerpt>

      <ul className="mb-8 space-y-3">
        {access.map((item) => (
          <li
            key={item}
            className="text-xs font-light leading-relaxed tracking-[0.08em] text-[var(--color-muted)]"
          >
            {item}
          </li>
        ))}
      </ul>

      <Link href={href} className="mt-auto w-full">
        <Button variant={tier === "individual" ? "primary" : "secondary"} fullWidthMobile className="w-full">
          {cta}
        </Button>
      </Link>
    </article>
  );
}
