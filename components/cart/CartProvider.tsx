"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Cart } from "@/lib/cart-types";

const EMPTY_CART: Cart = {
  id: "",
  checkoutUrl: null,
  totalQuantity: 0,
  cost: {
    subtotalAmount: { amount: "0", currencyCode: "USD" },
    totalAmount: { amount: "0", currencyCode: "USD" },
  },
  lines: [],
};

interface CartContextValue {
  cart: Cart;
  isOpen: boolean;
  isLoading: boolean;
  justAdded: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  refreshCart: () => Promise<void>;
  addItem: (variantId: string, quantity?: number, options?: { openDrawer?: boolean }) => Promise<boolean>;
  addItems: (items: { variantId: string; quantity?: number }[]) => Promise<boolean>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  checkout: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.cart) setCart(data.cart);
    } catch {
      /* keep existing cart */
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(t);
  }, [justAdded]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1, options?: { openDrawer?: boolean }) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId, quantity }),
        });
        const data = await res.json();
        if (data.cart) {
          setCart(data.cart);
          setJustAdded(true);
          if (options?.openDrawer !== false) setIsOpen(true);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const addItems = useCallback(
    async (items: { variantId: string; quantity?: number }[]) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const data = await res.json();
        if (data.cart) {
          setCart(data.cart);
          setJustAdded(true);
          setIsOpen(true);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId, quantity }),
      });
      const data = await res.json();
      if (data.cart) setCart(data.cart);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeLine = useCallback(async (lineId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId }),
      });
      const data = await res.json();
      if (data.cart) setCart(data.cart);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkout = useCallback(() => {
    if (cart.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  }, [cart.checkoutUrl]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isOpen,
      isLoading,
      justAdded,
      openDrawer: () => setIsOpen(true),
      closeDrawer: () => setIsOpen(false),
      toggleDrawer: () => setIsOpen((o) => !o),
      refreshCart,
      addItem,
      addItems,
      updateQuantity,
      removeLine,
      checkout,
    }),
    [cart, isOpen, isLoading, justAdded, refreshCart, addItem, addItems, updateQuantity, removeLine, checkout]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
