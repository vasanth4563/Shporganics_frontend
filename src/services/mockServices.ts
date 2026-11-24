import type { Order, Product, User } from '../types';
import { seedProducts } from '../data/products';
import { seedOrders, seedUsers } from '../data/seed';
import { KEYS, load, remove, save } from '../utils/storage';
import { api, Url } from './api';

export const normalizeProduct = (p: any): Product => ({
  id: String(p.id),
  name: p.name || '',
  category: p.category || 'snacks',
  subCategory: p.subCategory ?? p.sub_category ?? p.category ?? '',
  description: p.description ?? '',
  price: Number(p.price) || 0,
  discountPrice: Number(p.discountPrice ?? p.discount_price ?? p.price ?? 0),
  stock: Number.isFinite(Number(p.stock)) ? Number(p.stock) : 0,
  image: p.image ?? '',
  weight: p.weight ?? '',
  rating: Number(p.rating) || 0,
  sold: Number(p.sold) || 0,
  featured: Boolean(p.featured),
  bestSeller: Boolean(p.bestSeller ?? p.best_seller),
});

export const normalizeOrder = (o: any): Order => ({
  id: String(o.id),
  buyerId: o.buyerId != null ? String(o.buyerId) : o.buyer_id != null ? String(o.buyer_id) : '',
  buyerName: o.buyerName ?? o.buyer_name ?? '',
  email: o.email ?? '',
  phone: o.phone ?? '',
  shipping: o.shipping ?? { address: '', city: '', state: '', pincode: '' },
  items: (o.items ?? []).map((i: any) => ({
    productId: String(i.productId ?? i.product_id ?? ''),
    name: i.name ?? '',
    image: i.image ?? '',
    price: Number(i.price) || 0,
    quantity: Number(i.quantity) || 1,
  })),
  subtotal: Number(o.subtotal) || 0,
  delivery: Number(o.delivery) || 0,
  total: Number(o.total) || 0,
  paymentMode: o.paymentMode ?? o.payment_mode ?? 'Cash on Delivery',
  status: o.status ?? 'Placed',
  createdAt: o.createdAt ?? o.created_at ?? new Date().toISOString(),
  history: Array.isArray(o.history) ? o.history : [],
});

/** Product payload in the shape the FastAPI backend expects. */
const toProductPayload = (p: Partial<Product>) => {
  const body: Record<string, unknown> = { ...p };
  delete body.rating;
  delete body.sold;
  return body;
};

/**
 * Product service: the backend database is the single source of truth so every
 * client sees the same catalogue. localStorage is only used as an offline cache.
 */
export const productService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const res = await api.get<Product[]>(Url.products);
      if (Array.isArray(res.data)) {
        const normalized = res.data.map(normalizeProduct);
        save(KEYS.products, normalized);
        return normalized;
      }
    } catch {
      // Backend unreachable – fall back to the local cache
    }
    const local = load<Product[]>(KEYS.products, seedProducts);
    return Array.isArray(local) ? local.map(normalizeProduct) : [];
  },
  create: async (p: Omit<Product, 'id' | 'rating' | 'sold'>): Promise<Product> => {
    const res = await api.post(Url.products, toProductPayload(p));
    return normalizeProduct(res.data);
  },
  update: async (id: string, patch: Partial<Product>): Promise<Product> => {
    const res = await api.put(`${Url.products}/${encodeURIComponent(id)}`, toProductPayload(patch));
    return normalizeProduct(res.data);
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`${Url.products}/${encodeURIComponent(id)}`);
  },
  saveAll: (p: Product[]) => save(KEYS.products, p),
};

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    try {
      const res = await api.get(Url.orders);
      if (Array.isArray(res.data)) {
        const normalized = res.data.map(normalizeOrder);
        save(KEYS.orders, normalized);
        return normalized;
      }
    } catch {
      // Backend unreachable – fall back to the local cache
    }
    const local = load<Order[]>(KEYS.orders, seedOrders);
    return Array.isArray(local) ? local : [];
  },
  create: async (order: Order): Promise<Order> => {
    const numericBuyer = Number(order.buyerId);
    const res = await api.post(Url.orders, {
      id: order.id,
      buyerId: Number.isInteger(numericBuyer) && numericBuyer > 0 ? numericBuyer : null,
      buyerName: order.buyerName,
      email: order.email,
      phone: order.phone,
      items: order.items,
      subtotal: order.subtotal,
      delivery: order.delivery,
      total: order.total,
      paymentMode: order.paymentMode,
      shipping: order.shipping,
    });
    return normalizeOrder(res.data);
  },
  updateStatus: async (id: string, status: string): Promise<Order> => {
    const res = await api.patch(`${Url.orders}/${encodeURIComponent(id)}/status`, { status });
    return normalizeOrder(res.data);
  },
  saveAll: (o: Order[]) => save(KEYS.orders, o),
};

export const userService = {
  getAll: () => load<User[]>(KEYS.users, seedUsers),
  saveAll: (u: User[]) => save(KEYS.users, u),
};

/**
 * Bump this whenever cached demo data must be wiped from browsers.
 * v2 = production launch: removes all previously cached dummy products/orders/users.
 */
const DATA_VERSION = 'v2-clean';
const DATA_VERSION_KEY = 'shp_data_version';

/** Clears any old dummy data cached in the browser from earlier demo builds. */
export const bootstrapStorage = () => {
  try {
    if (localStorage.getItem(DATA_VERSION_KEY) !== DATA_VERSION) {
      remove(KEYS.products);
      remove(KEYS.orders);
      remove(KEYS.users);
      localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
    }
  } catch {
    // localStorage unavailable (private mode) – nothing to clean
  }
};

// Run immediately on module load so contexts never read stale demo data
bootstrapStorage();
