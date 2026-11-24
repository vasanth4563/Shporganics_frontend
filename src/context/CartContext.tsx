import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';
import { KEYS, load, save } from '../utils/storage';
import { useProducts } from './ProductContext';
import { deliveryFor } from '../utils/format';

export interface CartLine extends CartItem {
  product: Product;
  lineTotal: number;
}

interface CartCtx {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  quickCheckoutOpen: boolean;
  openQuickCheckout: () => void;
  closeQuickCheckout: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useProducts();
  const [items, setItems] = useState<CartItem[]>(() => {
    const raw = load<CartItem[]>(KEYS.cart, []);
    return Array.isArray(raw) ? raw : [];
  });
  const [quickCheckoutOpen, setQuickCheckoutOpen] = useState(false);

  const openQuickCheckout = useCallback(() => setQuickCheckoutOpen(true), []);
  const closeQuickCheckout = useCallback(() => setQuickCheckoutOpen(false), []);

  const commit = useCallback((fn: (prev: CartItem[]) => CartItem[]) => {
    setItems((prev) => {
      const next = fn(prev);
      save(KEYS.cart, next);
      return next;
    });
  }, []);

  const lines = useMemo<CartLine[]>(
    () =>
      items
        .map((i) => {
          const product = products.find((p) => p.id === i.productId);
          return product ? { ...i, product, lineTotal: product.discountPrice * i.quantity } : null;
        })
        .filter((x): x is CartLine => x !== null),
    [items, products],
  );

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const delivery = deliveryFor(subtotal);

  const value: CartCtx = {
    items,
    lines,
    count: lines.reduce((s, l) => s + l.quantity, 0),
    subtotal,
    delivery,
    total: subtotal + delivery,
    quickCheckoutOpen,
    openQuickCheckout,
    closeQuickCheckout,
    add: (productId, qty = 1) => {
      commit((prev) => {
        const stock = products.find((p) => p.id === productId)?.stock ?? 0;
        const existing = prev.find((i) => i.productId === productId);
        if (existing)
          return prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.min(stock, i.quantity + qty) } : i));
        return [...prev, { productId, quantity: Math.min(stock, qty) }];
      });
      setQuickCheckoutOpen(true);
    },
    setQty: (productId, qty) =>
      commit((prev) =>
        qty <= 0 ? prev.filter((i) => i.productId !== productId) : prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)),
      ),
    remove: (productId) => commit((prev) => prev.filter((i) => i.productId !== productId)),
    clear: () => commit(() => []),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be inside CartProvider');
  return c;
};
