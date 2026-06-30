"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface TextLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function TextLink({ href, children, className = "" }: TextLinkProps) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 ${className}`}>
      <motion.span
        className="font-sans text-sm font-light tracking-wide text-[var(--color-muted)] transition-colors duration-500 group-hover:text-[var(--color-sea)]"
        whileHover={{ x: 2 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </Link>
  );
}
