import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { brand } from "@/lib/brand";

const footerLinkClass =
  "inline-flex min-h-[44px] items-center justify-center px-2 text-center text-xs tracking-[0.14em] uppercase text-[var(--color-muted)] transition-colors duration-500 hover:text-[var(--color-text)] sm:tracking-[0.2em]";

export function Footer() {
  return (
    <footer className="safe-bottom border-t border-[var(--color-border)] bg-[var(--color-bg)] py-10 sm:py-[var(--space-2xl)]">
      <Container className="text-center">
        <div className="flex flex-col items-center gap-8 sm:gap-10">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center font-serif text-sm tracking-[0.2em] text-[var(--color-muted)] transition-colors duration-500 hover:text-[var(--color-text)] sm:tracking-[0.28em]"
          >
            ORIVANA
          </Link>

          <nav className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-1 sm:gap-x-8 md:gap-x-10">
            {[
              { href: "/shop", label: "Shop" },
              { href: "/collections", label: "Collections" },
              { href: "/journal", label: brand.journalTitle },
              { href: "/recipes", label: brand.culinaryJournal },
              { href: "/story", label: "Our Story" },
              { href: "/membership", label: brand.harvestCircle },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className={footerLinkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <a
            href="https://instagram.com/orivanastore"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Orivana on Instagram"
            className="inline-flex min-h-[44px] items-center justify-center px-2 text-xs tracking-[0.14em] text-[var(--color-muted)] normal-case transition-colors duration-500 hover:text-[var(--color-text)] sm:tracking-[0.16em]"
          >
            @orivanastore
          </a>
        </div>

        <p className="mt-8 pb-6 text-center text-xs tracking-[0.12em] text-[var(--color-muted)]/60 sm:mt-12 sm:pb-8">
          © {new Date().getFullYear()} Orivana
        </p>
      </Container>
    </footer>
  );
}
