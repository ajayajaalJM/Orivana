import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { Caption } from "@/components/ui/Typography";
import { TextLink } from "@/components/ui/TextLink";
import { TierCard } from "@/components/membership/TierCard";
import { brand } from "@/lib/brand";

export function MembershipLanding() {
  const { individual, restaurant, wholesale } = brand.tiers;

  return (
    <Section className="page-top">
      <Container wide>
        <PageHeader
          title={brand.innerCircleLandingTitle}
          description={brand.innerCircleLandingSubtitle}
        />

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
          <TierCard
            tier="individual"
            name={individual.name}
            tagline={individual.tagline}
            description={individual.description}
            access={individual.access}
            cta={individual.cta}
            href="/membership/join"
          />
          <TierCard
            tier="restaurant"
            name={restaurant.name}
            tagline={restaurant.tagline}
            description={restaurant.description}
            access={restaurant.access}
            cta={restaurant.cta}
            href="/membership/apply/restaurant"
          />
          <TierCard
            tier="wholesale"
            name={wholesale.name}
            tagline={wholesale.tagline}
            description={wholesale.description}
            access={wholesale.access}
            cta={wholesale.cta}
            href="/membership/apply/wholesale"
          />
        </div>

        <div className="border-t border-[var(--color-border)] pt-10 text-center">
          <Caption className="mb-4 block">Already within the circle?</Caption>
          <TextLink href="/membership/login">{brand.innerCircleLogin} →</TextLink>
        </div>
      </Container>
    </Section>
  );
}
