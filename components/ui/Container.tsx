import { type ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}

export function Container({ children, className = "", wide = false }: ContainerProps) {
  return (
    <div
      className={`
        mx-auto w-full min-w-0 px-5 sm:px-6 md:px-8
        ${wide ? "max-w-[1400px]" : "max-w-[var(--max-width)]"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
