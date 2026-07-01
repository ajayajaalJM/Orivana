import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { brand } from "@/lib/brand";
import { createPageMetadata } from "@/lib/metadata";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description: `Correspondence with the House of Orivana — ${brand.tagline}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Section className="page-top">
        <Container>
          <div className="mx-auto max-w-lg text-center">
            <PageHeader
              title="Contact"
              description="For inquiries regarding harvests, the Inner Circle, or press — we welcome your correspondence."
            />
            <a
              href="mailto:concierge@orivana.com"
              className="inline-block break-all font-serif text-xl text-[var(--color-accent)] transition-opacity duration-500 hover:opacity-80 sm:text-2xl"
            >
              concierge@orivana.com
            </a>
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
}
