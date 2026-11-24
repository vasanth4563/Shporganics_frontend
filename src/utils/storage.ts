export const KEYS = {
  users: 'shp_users',
  session: 'shp_session',
  cart: 'shp_cart',
  products: 'shp_products',
  orders: 'shp_orders',
  addresses: 'shp_saved_addresses',
} as const;

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded (large images) – ignore in demo
  }
}

export function remove(key: string) {
  localStorage.removeItem(key);
}
