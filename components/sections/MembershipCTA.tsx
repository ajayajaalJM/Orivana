"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { H2, Excerpt } from "@/components/ui/Typography";
import { brand } from "@/lib/brand";
import { Button } from "@/components/ui/Button";

export function MembershipCTA() {
  return (
    <Section>
      <Container>
        <ScrollReveal>
          <div className="membership-glow relative px-4 py-16 text-center sm:px-8 sm:py-[var(--space-3xl)] md:px-16">
            <div className="relative z-10">
              <H2 className="mb-6 sm:mb-8">{brand.harvestCircleJoin}</H2>
              <Excerpt className="mx-auto mb-8 max-w-md sm:mb-10">
                {brand.harvestCircleDescription}
              </Excerpt>
              <ul className="mx-auto mb-10 max-w-sm space-y-3 text-left sm:mb-14">
                {brand.harvestCircleBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="text-xs font-light tracking-[0.12em] uppercase text-[var(--color-muted)]"
                  >
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
                <Link href="/membership/join" className="w-full sm:w-auto">
                  <Button variant="primary" fullWidthMobile>
                    {brand.harvestCircleJoin}
                  </Button>
                </Link>
                <Link href="/membership/login" className="w-full sm:w-auto">
                  <Button variant="secondary" fullWidthMobile>
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
