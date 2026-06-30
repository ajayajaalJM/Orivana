"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { getHeroBackgroundUrl } from "@/lib/sanity";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundVideoUrl?: string;
}

export function HeroSection({ title, subtitle, ctaText, backgroundVideoUrl }: HeroSectionProps) {
  const bgUrl = getHeroBackgroundUrl();

  const scrollToFeatured = () => {
    document.getElementById("featured-harvest")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
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

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 pb-16 pt-[var(--nav-height)] text-center sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[95vw] font-serif text-[var(--text-hero)] font-normal tracking-[0.03em] text-[var(--color-on-image)] sm:max-w-none sm:tracking-[0.05em]"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xs font-sans text-[10px] font-light leading-relaxed tracking-[0.25em] uppercase text-[var(--color-on-image)]/85 sm:mt-8 sm:max-w-md sm:text-xs md:text-sm md:tracking-[0.3em]"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 w-full max-w-xs sm:mt-14 sm:max-w-none"
        >
          <Button onClick={scrollToFeatured} fullWidthMobile className="w-full sm:w-auto !border-[var(--color-on-image)]/60 !bg-[var(--color-on-image)]/10 !text-[var(--color-on-image)] hover:!border-[var(--color-on-image)] hover:!bg-[var(--color-on-image)]/20">
            {ctaText}
          </Button>
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
