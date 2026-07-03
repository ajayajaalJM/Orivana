"use client";

import { usePathname } from "next/navigation";
import { Nav } from "@/components/ui/Nav";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

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
