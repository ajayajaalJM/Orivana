"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";
import { useCart } from "@/components/cart/CartProvider";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/journal", label: brand.journalTitle },
  { href: "/membership", label: brand.harvestCircle, accent: true },
];

export function Nav() {
  const pathname = usePathname();
  const { cart, toggleDrawer } = useCart();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const showSolidNav = scrolled || !isHome || menuOpen;
  // Mobile always renders a solid light header (max-lg:bg). Light-on-image text is desktop-only
  // so logo, cart, and menu stay readable over the hero without white-on-white on small screens.
  const heroOverlayNav = isHome && !scrolled && !menuOpen;

  const navTextClass = heroOverlayNav
    ? "text-[var(--color-text)] lg:text-[var(--color-on-image)]"
    : "text-[var(--color-text)]";

  const navIconBarClass = heroOverlayNav
    ? "bg-[var(--color-text)] lg:bg-[var(--color-on-image)]"
    : "bg-[var(--color-text)]";

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: isHome ? 0.5 : 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 safe-top max-lg:border-b max-lg:border-[var(--color-border)] max-lg:bg-[var(--color-bg)]/95 max-lg:backdrop-blur-md ${
          showSolidNav
            ? "border-b border-[var(--color-border)] bg-[var(--color-bg)]/92 backdrop-blur-md shadow-[0_1px_0_var(--color-shadow)]"
            : "lg:bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[var(--max-width)] items-center justify-between px-6 py-4 lg:px-8 lg:py-7">
          <Link
            href="/"
            className={`relative z-[60] shrink-0 font-serif text-sm tracking-[0.2em] sm:tracking-[0.28em] lg:text-lg lg:tracking-[0.32em] ${navTextClass}`}
          >
            ORIVANA
          </Link>

          <div className="hidden min-w-0 items-center gap-6 lg:flex xl:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap text-xs tracking-[0.18em] uppercase transition-colors duration-500 xl:tracking-[0.22em] ${
                  pathname.startsWith(link.href)
                    ? isHome && !scrolled && !menuOpen
                      ? "text-[var(--color-on-image)]"
                      : "text-[var(--color-text)]"
                    : link.accent
                      ? isHome && !scrolled && !menuOpen
                        ? "text-[var(--color-on-image)]/80 hover:text-[var(--color-on-image)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                      : isHome && !scrolled && !menuOpen
                        ? "text-[var(--color-on-image)]/75 hover:text-[var(--color-on-image)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="relative z-[60] flex shrink-0 items-center gap-4 sm:gap-5">
            <button
              type="button"
              onClick={toggleDrawer}
              className={`relative flex h-11 min-w-[44px] items-center justify-center transition-opacity hover:opacity-70 ${navTextClass}`}
              aria-label={brand.harvestSelection}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M5 6.5h10M5 10h10M5 13.5h7"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
              {cart.totalQuantity > 0 && (
                <span className="absolute -right-1 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[9px] text-[var(--color-bg)]">
                  {cart.totalQuantity}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
            >
            <span
              className={`block h-px w-5 transition-all duration-500 ${navIconBarClass} ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-5 transition-all duration-500 ${navIconBarClass} ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-5 transition-all duration-500 ${navIconBarClass} ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`}
            />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-[var(--color-bg)] backdrop-blur-sm lg:hidden"
            style={{
              paddingTop: "calc(var(--nav-height) + env(safe-area-inset-top, 0px))",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            <nav className="flex flex-col items-center gap-8 px-8 py-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block min-h-[48px] px-4 py-2 text-center font-serif text-2xl tracking-[0.04em] transition-colors duration-500 sm:text-3xl sm:tracking-[0.06em] ${
                      pathname.startsWith(link.href)
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
