"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { getHeroBackgroundUrl } from "@/lib/sanity";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundVideoUrl?: string;
  backgroundImageUrl?: string;
}

const heroCtaClass =
  "inline-flex min-h-[48px] w-full items-center justify-center rounded-[var(--radius-button)] border border-[var(--color-on-image)]/60 bg-[var(--color-on-image)]/10 px-8 py-3.5 text-xs font-light tracking-[0.12em] uppercase text-[var(--color-on-image)] transition-colors duration-500 hover:border-[var(--color-on-image)] hover:bg-[var(--color-on-image)]/20 sm:w-auto sm:text-[11px] sm:tracking-[0.14em]";

export function HeroSection({
  title,
  subtitle,
  ctaText,
  backgroundVideoUrl,
  backgroundImageUrl,
}: HeroSectionProps) {
  const bgUrl = backgroundImageUrl || getHeroBackgroundUrl();

  return (
    <section className="scroll-snap-section relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        {backgroundVideoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover img-editorial"
            poster={bgUrl}
          >
            <source src={backgroundVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={bgUrl}
            alt="Orivana hero"
            fill
            priority
            sizes="100vw"
            className="object-cover img-editorial"
          />
        )}
        <div className="absolute inset-0 bg-[var(--color-overlay)]" />
        <div className="vignette" />
        <div className="grain-overlay" />
      </motion.div>

      <div className="content-below-nav relative z-10 flex h-full flex-col items-center justify-center px-5 pb-20 text-center safe-bottom sm:px-6 sm:pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="hero-wordmark w-full max-w-[100vw] break-words"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-sm font-sans text-[11px] font-light leading-relaxed tracking-[0.16em] uppercase text-[var(--color-on-image)]/80 sm:mt-8 sm:max-w-lg sm:text-sm sm:tracking-[0.28em] md:text-base md:tracking-[0.32em]"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex w-full max-w-xs justify-center sm:mt-16 sm:max-w-none"
        >
          <Link href="/collections" className={heroCtaClass}>
            {ctaText}
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 safe-bottom sm:bottom-10"
      >
        <div className="scroll-hint-line" />
      </motion.div>
    </section>
  );
}
