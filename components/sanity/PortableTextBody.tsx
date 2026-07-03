import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-[var(--space-lg)] last:mb-0">{children}</p>
    ),
  },
};

interface PortableTextBodyProps {
  value: PortableTextBlock[];
  className?: string;
}

export function PortableTextBody({ value, className }: PortableTextBodyProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
