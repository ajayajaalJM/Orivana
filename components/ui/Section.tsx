import { type ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Alternate sand-toned section layer */
  dark?: boolean;
}

export function Section({ children, className = "", id, dark = false }: SectionProps) {
  return (
    <section
      id={id}
      className={`
        scroll-snap-section
        py-12 md:py-[var(--space-2xl)] lg:py-[var(--space-3xl)]
        ${dark ? "bg-[var(--color-surface-alt)]" : "bg-[var(--color-bg)]"}
        ${className}
      `}
    >
      {children}
    </section>
  );
}
