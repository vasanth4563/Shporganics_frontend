import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Order, OrderStatus } from '../types';
import { orderService } from '../services/mockServices';
import { KEYS, load } from '../utils/storage';
import { generateOrderId } from '../utils/format';

type NewOrder = Omit<Order, 'id' | 'status' | 'createdAt' | 'history'>;

interface OrderCtx {
  orders: Order[];
  loading: boolean;
  placeOrder: (o: NewOrder) => Order;
  updateStatus: (id: string, status: OrderStatus) => void;
  ordersFor: (buyerId: string) => Order[];
  refresh: () => Promise<void>;
}

const Ctx = createContext<OrderCtx | null>(null);

/** How often to pull new orders so sellers see orders from other clients. */
const REFRESH_MS = 20000;

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const raw = load<Order[]>(KEYS.orders, []);
    return Array.isArray(raw) ? raw : [];
  });
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    const list = await orderService.getAll();
    if (mounted.current) {
      setOrders(list);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();

    const timer = window.setInterval(refresh, REFRESH_MS);
    const onFocus = () => refresh();
    // keep buyer & seller views in sync across tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEYS.orders) setOrders(load<Order[]>(KEYS.orders, []));
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

  const commit = useCallback((fn: (prev: Order[]) => Order[]) => {
    setOrders((prev) => {
      const next = fn(prev);
      orderService.saveAll(next);
      return next;
    });
  }, []);

  const placeOrder = (o: NewOrder): Order => {
    const now = new Date().toISOString();
    const order: Order = { ...o, id: generateOrderId(), status: 'Placed', createdAt: now, history: [{ status: 'Placed', date: now }] };
    commit((prev) => [order, ...prev]);

    // Persist to the backend (same ID is kept so tracking links keep working)
    orderService
      .create(order)
      .then((saved) => commit((prev) => prev.map((x) => (x.id === order.id ? saved : x))))
      .catch(() => {
        /* offline – order stays in the local cache */
      });
    return order;
  };

  const updateStatus = (id: string, status: OrderStatus) => {
    commit((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const history = o.history.filter((h) => h.status !== status);
        return { ...o, status, history: [...history, { status, date: new Date().toISOString() }] };
      }),
    );
    orderService
      .updateStatus(id, status)
      .then((saved) => commit((prev) => prev.map((x) => (x.id === id ? saved : x))))
      .catch(() => {
        /* offline – status stays in the local cache */
      });
  };

  const sorted = [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <Ctx.Provider
      value={{
        orders: sorted,
        loading,
        placeOrder,
        updateStatus,
        ordersFor: (id) => sorted.filter((o) => String(o.buyerId) === String(id)),
        refresh,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useOrders = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useOrders must be inside OrderProvider');
  return c;
};
