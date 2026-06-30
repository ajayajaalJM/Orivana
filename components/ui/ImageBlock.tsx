"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ImageBlockProps {
  src: string;
  alt: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "hero" | "tall";
  priority?: boolean;
  className?: string;
  fill?: boolean;
  parallax?: boolean;
  hoverZoom?: boolean;
}

const aspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  tall: "aspect-[4/5] sm:aspect-[2/3]",
  landscape: "aspect-[4/3]",
  hero: "aspect-[16/9]",
};

export function ImageBlock({
  src,
  alt,
  aspectRatio = "landscape",
  priority = false,
  className = "",
  fill = false,
  parallax = false,
  hoverZoom = false,
}: ImageBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [parallaxEnabled, setParallaxEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setParallaxEnabled(parallax && mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [parallax]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxEnabled ? ["-4%", "4%"] : ["0%", "0%"]
  );

  return (
    <div
      ref={ref}
      className={`editorial-image relative overflow-hidden bg-[var(--color-surface)] ${fill ? "absolute inset-0" : aspectClasses[aspectRatio]} ${className}`}
    >
      <motion.div
        className={`absolute inset-[-8%] ${hoverZoom ? "transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] max-lg:scale-100" : ""}`}
        style={parallaxEnabled ? { y } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 50vw"
          className="object-cover img-editorial"
        />
      </motion.div>
    </div>
  );
}
