"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/cart/CartProvider";
import { HarvestDrawer } from "@/components/cart/HarvestDrawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <HarvestDrawer />
      </CartProvider>
    </SessionProvider>
  );
}
