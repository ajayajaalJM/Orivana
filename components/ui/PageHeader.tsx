import { type ReactNode } from "react";
import { H1, Excerpt } from "@/components/ui/Typography";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className = "" }: PageHeaderProps) {
  return (
    <header className={`mb-8 sm:mb-14 md:mb-[var(--space-2xl)] ${className}`}>
      <H1 as="h1" className="page-title mb-4 sm:mb-6">
        {title}
      </H1>
      {description && (
        <Excerpt className="max-w-2xl">{description}</Excerpt>
      )}
      {children}
    </header>
  );
}
