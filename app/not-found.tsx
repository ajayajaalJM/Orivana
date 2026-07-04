import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { Caption, Excerpt, H1 } from "@/components/ui/Typography";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

const primaryCta =
  "inline-flex min-h-[48px] items-center justify-center rounded-[var(--radius-button)] border border-[var(--color-accent)] bg-[var(--color-accent)] px-8 py-3.5 text-[11px] font-light tracking-[0.14em] uppercase text-[var(--color-bg)] transition-colors duration-500 hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-hover)]";

const secondaryCta =
  "inline-flex min-h-[48px] items-center justify-center rounded-[var(--radius-button)] border border-[var(--color-olive)] bg-transparent px-8 py-3.5 text-[11px] font-light tracking-[0.14em] uppercase text-[var(--color-olive)] transition-colors duration-500 hover:bg-[var(--color-olive)]/5";

export default function NotFound() {
  return (
    <>
      <section className="page-top relative min-h-[calc(100dvh-var(--nav-height))] bg-[var(--color-bg)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,138,60,0.07)_0%,transparent_62%)]"
          aria-hidden
        />
        <div className="grain-overlay opacity-[0.025]" aria-hidden />

        <Container className="relative z-10 flex min-h-[calc(100dvh-var(--nav-height)-var(--space-2xl))] flex-col items-center justify-center py-[var(--space-2xl)] md:py-[var(--space-3xl)]">
          <div className="mx-auto max-w-2xl text-center">
            <Caption className="mb-6 block sm:mb-8">Page Not Found</Caption>

            <H1 className="page-title mb-6 sm:mb-8">This page could not be found</H1>

            <p
              className="font-serif text-[clamp(5.5rem,22vw,12rem)] font-normal leading-[0.9] tracking-[0.06em] text-[var(--color-text)]/15 sm:tracking-[0.1em]"
              aria-hidden
            >
              404
            </p>

            <div
              className="mx-auto my-8 h-px w-14 bg-[var(--color-accent)] opacity-50 sm:my-10 sm:w-20"
              aria-hidden
            />

            <Excerpt className="mx-auto max-w-md">
              This path does not lead anywhere in the House of Orivana — the page may have
              moved, or the address was mistyped.
            </Excerpt>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link href="/" className={`${primaryCta} w-full max-w-[280px] sm:w-auto`}>
                Return Home
              </Link>
              <Link href="/collections" className={`${secondaryCta} w-full max-w-[280px] sm:w-auto`}>
                {brand.exploreCollection}
              </Link>
            </div>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
}
