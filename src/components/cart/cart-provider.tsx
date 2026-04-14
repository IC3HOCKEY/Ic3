"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { CartLine, Money } from "@/lib/types";

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
};

type CartContextValue = CartState & {
  subtotal: Money;
  itemCount: number;
  addLine: (line: CartLine) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "ic3.cart.v1";

function readFromStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is CartLine =>
        !!line &&
        typeof line.variantId === "string" &&
        typeof line.quantity === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(readFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // swallow quota errors silently
    }
  }, [lines, hydrated]);

  const addLine = useCallback((newLine: CartLine) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === newLine.variantId);
      if (existing) {
        return prev.map((l) =>
          l.variantId === newLine.variantId
            ? { ...l, quantity: l.quantity + newLine.quantity }
            : l,
        );
      }
      return [...prev, newLine];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) =>
            l.variantId === variantId ? { ...l, quantity } : l,
          ),
    );
  }, []);

  const removeLine = useCallback((variantId: string) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const subtotal = useMemo<Money>(() => {
    const total = lines.reduce((sum, l) => {
      const amount = Number(l.price.amount);
      return sum + amount * l.quantity;
    }, 0);
    const code = lines[0]?.price.currencyCode ?? "SEK";
    return { amount: total.toFixed(2), currencyCode: code };
  }, [lines]);

  const itemCount = useMemo(
    () => lines.reduce((n, l) => n + l.quantity, 0),
    [lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      isOpen,
      subtotal,
      itemCount,
      addLine,
      updateQuantity,
      removeLine,
      clear,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      lines,
      isOpen,
      subtotal,
      itemCount,
      addLine,
      updateQuantity,
      removeLine,
      clear,
      openCart,
      closeCart,
      toggleCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
