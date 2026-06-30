"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFirstMount = useRef(true);

  useEffect(() => {
    isFirstMount.current = false;
  }, []);

  return (
    <motion.div
      key={pathname}
      initial={isFirstMount.current ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
