"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { animation } from "@/lib/design-tokens";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  fullWidthMobile?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-[var(--color-bg)] border border-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] hover:border-[var(--color-accent-hover)]",
  secondary:
    "bg-transparent text-[var(--color-olive)] border border-[var(--color-olive)] hover:bg-[var(--color-olive)]/5",
  ghost:
    "bg-transparent text-[var(--color-muted)] border border-transparent hover:text-[var(--color-olive)] px-0 py-0 tracking-normal normal-case underline-offset-4 hover:underline",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", fullWidthMobile = false, className = "", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: animation.hover.scale }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: animation.hover.duration, ease: animation.ease }}
        className={`
          inline-flex min-h-[48px] items-center justify-center
          rounded-[var(--radius-button)]
          px-5 py-3.5 sm:px-8
          text-[11px] tracking-[0.14em] uppercase font-sans font-light
          whitespace-normal text-center leading-snug
          transition-colors duration-500
          disabled:opacity-40 disabled:cursor-not-allowed
          ${fullWidthMobile ? "w-full sm:w-auto" : ""}
          ${variants[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
