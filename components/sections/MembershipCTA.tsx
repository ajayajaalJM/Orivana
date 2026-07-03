"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { H2, Excerpt, Caption } from "@/components/ui/Typography";
import { brand } from "@/lib/brand";
import { Button } from "@/components/ui/Button";

const benefitNumerals = ["I", "II", "III"] as const;

export function MembershipCTA() {
  return (
    <Section>
      <Container>
        <ScrollReveal>
          <div className="membership-glow relative px-4 py-16 text-center sm:px-8 sm:py-[var(--space-3xl)] md:px-16">
            <div className="relative z-10">
              <Caption className="mb-6 block sm:mb-8">{brand.harvestCircle}</Caption>
              <H2 className="mb-6 sm:mb-8">{brand.harvestCircleJoin}</H2>
              <Excerpt className="mx-auto mb-10 max-w-lg sm:mb-12">
                {brand.harvestCircleDescription}
              </Excerpt>

              <div className="mx-auto mb-10 max-w-4xl border-y border-[var(--color-border)] sm:mb-14">
                <Caption className="mb-0 block py-8 sm:py-10">
                  Membership Privileges
                </Caption>
                <ul className="grid grid-cols-1 md:grid-cols-3">
                  {brand.harvestCircleBenefits.map((benefit, index) => (
                    <li
                      key={benefit}
                      className={`flex flex-col items-center px-6 py-8 text-center sm:px-8 sm:py-10 ${
                        index > 0 ? "border-t border-[var(--color-border)] md:border-t-0 md:border-l" : ""
                      }`}
                    >
                      <span
                        aria-hidden
                        className="mb-5 font-serif text-sm tracking-[0.28em] text-[var(--color-accent)] sm:mb-6"
                      >
                        {benefitNumerals[index]}
                      </span>
                      <p className="mx-auto max-w-[16rem] font-serif text-lg leading-[1.65] tracking-[0.02em] text-[var(--color-text)] sm:max-w-[17rem] sm:text-xl sm:leading-[1.6] md:max-w-none">
                        {benefit}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

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
