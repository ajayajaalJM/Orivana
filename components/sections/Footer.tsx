import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="safe-bottom border-t border-[var(--color-border)] bg-[var(--color-bg)] py-12 sm:py-[var(--space-2xl)]">
      <Container>
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:flex-row md:items-start md:justify-between">
          <Link
            href="/"
            className="shrink-0 font-serif text-sm tracking-[0.2em] text-[var(--color-muted)] transition-colors duration-500 hover:text-[var(--color-text)] sm:tracking-[0.28em]"
          >
            ORIVANA
          </Link>

          <nav className="grid w-full max-w-sm grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-8 md:gap-10">
            {[
              { href: "/shop", label: "Shop" },
              { href: "/collections", label: "Collections" },
              { href: "/journal", label: brand.journalTitle },
              { href: "/membership", label: brand.harvestCircle },
              { href: "/recipes", label: brand.culinaryJournal },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-center text-xs tracking-[0.14em] uppercase text-[var(--color-muted)] transition-colors duration-500 hover:text-[var(--color-text)] sm:text-left sm:tracking-[0.2em]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 gap-8">
            {[
              { label: "Instagram", href: "#" },
              { label: "Pinterest", href: "#" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-xs tracking-[0.15em] uppercase text-[var(--color-muted)] transition-colors duration-500 hover:text-[var(--color-text)]"
              >
                {social.label === "Instagram" ? "Ig" : "Pi"}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-xs tracking-[0.12em] text-[var(--color-muted)]/60 sm:mt-16">
          © {new Date().getFullYear()} Orivana
        </p>
      </Container>
    </footer>
  );
}
