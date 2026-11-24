import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Product } from '../types';
import { normalizeProduct, productService } from '../services/mockServices';
import { KEYS, load } from '../utils/storage';
import { uid } from '../utils/format';

interface ProductCtx {
  products: Product[];
  loading: boolean;
  getById: (id: string) => Product | undefined;
  addProduct: (p: Omit<Product, 'id' | 'rating' | 'sold'>) => Promise<boolean>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  reduceStock: (lines: { productId: string; quantity: number }[]) => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<ProductCtx | null>(null);

/** How often to pull the latest catalogue so all clients stay in sync. */
const REFRESH_MS = 30000;

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const raw = load<Product[]>(KEYS.products, []);
    return Array.isArray(raw) ? raw.map(normalizeProduct) : [];
  });
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    const list = await productService.getAll();
    if (mounted.current) {
      setProducts(list);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();

    const timer = window.setInterval(refresh, REFRESH_MS);
    const onFocus = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEYS.products) setProducts(load<Product[]>(KEYS.products, []).map(normalizeProduct));
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    return () => {
      mounted.current = false;
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
    };
  }, [refresh]);

  const commitLocal = useCallback((fn: (prev: Product[]) => Product[]) => {
    setProducts((prev) => {
      const next = fn(prev);
      productService.saveAll(next);
      return next;
    });
  }, []);

  const addProduct: ProductCtx['addProduct'] = async (p) => {
    try {
      const created = await productService.create(p);
      commitLocal((prev) => [created, ...prev.filter((x) => x.id !== created.id)]);
      return true;
    } catch (err: any) {
      if (err?.response) return false; // backend rejected (validation etc.)
      // Offline fallback so the UI still works locally
      commitLocal((prev) => [{ ...p, id: uid('p-'), rating: 0, sold: 0 }, ...prev]);
      return true;
    }
  };

  const updateProduct: ProductCtx['updateProduct'] = async (id, patch) => {
    const previous = products;
    commitLocal((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    try {
      const saved = await productService.update(id, patch);
      commitLocal((prev) => prev.map((p) => (p.id === id ? saved : p)));
      return true;
    } catch (err: any) {
      if (err?.response) {
        commitLocal(() => previous);
        return false;
      }
      return true;
    }
  };

  const deleteProduct: ProductCtx['deleteProduct'] = async (id) => {
    const previous = products;
    commitLocal((prev) => prev.filter((p) => p.id !== id));
    try {
      await productService.remove(id);
      return true;
    } catch (err: any) {
      if (err?.response && err.response.status !== 404) {
        commitLocal(() => previous);
        return false;
      }
      return true;
    }
  };

  /** Optimistic local stock update – the backend decrements stock when the order is saved. */
  const reduceStock: ProductCtx['reduceStock'] = (lines) =>
    commitLocal((prev) =>
      prev.map((p) => {
        const l = lines.find((x) => x.productId === p.id);
        return l ? { ...p, stock: Math.max(0, p.stock - l.quantity), sold: p.sold + l.quantity } : p;
      }),
    );

  const value: ProductCtx = {
    products,
    loading,
    getById: (id) => products.find((p) => p.id === id),
    addProduct,
    updateProduct,
    deleteProduct,
    reduceStock,
    refresh,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useProducts = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useProducts must be inside ProductProvider');
  return c;
};
