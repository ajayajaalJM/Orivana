import { type ReactNode } from "react";

interface TypographyProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const headingSafe =
  "break-words overflow-visible [overflow-wrap:anywhere] [hyphens:auto]";

export function H1({ children, className = "", as: Tag = "h1" }: TypographyProps) {
  return (
    <Tag
      className={`font-serif font-normal text-[var(--text-hero)] leading-[1.15] tracking-[0.02em] text-[var(--color-text)] sm:leading-[1.1] sm:tracking-[0.04em] ${headingSafe} ${className}`}
    >
      {children}
    </Tag>
  );
}

export function H2({ children, className = "", as: Tag = "h2" }: TypographyProps) {
  return (
    <Tag
      className={`font-serif font-normal text-[var(--text-h2)] leading-[1.18] tracking-[0.02em] text-[var(--color-text)] sm:leading-[1.12] sm:tracking-[0.03em] ${headingSafe} ${className}`}
    >
      {children}
    </Tag>
  );
}

export function H3({ children, className = "", as: Tag = "h3" }: TypographyProps) {
  return (
    <Tag
      className={`font-serif font-normal text-[var(--text-h3)] leading-[1.25] tracking-[0.01em] text-[var(--color-text)] sm:leading-[1.2] sm:tracking-[0.02em] ${headingSafe} ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Body({ children, className = "", as: Tag = "p" }: TypographyProps) {
  return (
    <Tag
      className={`font-sans font-light text-[var(--text-body)] leading-[1.75] text-[var(--color-text-soft)] break-words [overflow-wrap:anywhere] ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Caption({ children, className = "", as: Tag = "span" }: TypographyProps) {
  return (
    <Tag
      className={`font-sans font-light text-[var(--text-small)] tracking-[0.12em] uppercase text-[var(--color-muted)] break-words sm:tracking-[0.2em] ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Price({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`font-sans text-sm font-light tracking-wide text-[var(--color-muted)] break-words ${className}`}
    >
      {children}
    </span>
  );
}

interface ExcerptProps extends TypographyProps {
  italic?: boolean;
}

export function Excerpt({
  children,
  className = "",
  as: Tag = "p",
  italic = false,
}: ExcerptProps) {
  return (
    <Tag
      className={`font-serif font-normal text-lg leading-[1.85] tracking-[0.015em] text-[var(--color-text-soft)] sm:text-xl sm:leading-[1.82] ${italic ? "italic" : ""} break-words [overflow-wrap:anywhere] ${className}`}
    >
      {children}
    </Tag>
  );
}
