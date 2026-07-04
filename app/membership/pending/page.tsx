import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { H1, Excerpt, Caption } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/sections/Footer";
import { brand } from "@/lib/brand";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: brand.applicationPending,
  description: brand.applicationPendingDescription,
  path: "/membership/pending",
  noIndex: true,
});

export default function PendingPage() {
  return (
    <>
      <Section className="page-top">
        <Container>
          <div className="mx-auto max-w-lg py-12 text-center">
            <Caption className="mb-6 block">{brand.applicationSubmitted}</Caption>
            <H1 className="!text-[var(--text-h2)] mb-6">{brand.applicationPending}</H1>
            <Excerpt className="mb-10">{brand.applicationPendingDescription}</Excerpt>
            <Link href="/membership">
              <Button variant="secondary">Return to Inner Circle</Button>
            </Link>
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
}
