"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Nav } from "@/components/ui/Nav";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");
  const isHome = pathname === "/";

  useEffect(() => {
    if (isStudio) return;

    document.documentElement.classList.toggle("scroll-snap-home", isHome);

    return () => {
      document.documentElement.classList.remove("scroll-snap-home");
    };
  }, [isHome, isStudio]);

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      <main className="page-enter">{children}</main>
    </>
  );
}
