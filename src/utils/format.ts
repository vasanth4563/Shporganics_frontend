import type { Category, OrderStatus } from '../types';

export const formatPrice = (n: number | undefined | null) =>
  '₹' + (Number(n) || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

export const formatDate = (iso: string | undefined | null) => {
  if (!iso) return 'Recent';
  try {
    const d = new Date(iso);
    return isNaN(d.getTime())
      ? 'Recent'
      : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return 'Recent';
  }
};

export const discountPercent = (price: number | undefined, discount: number | undefined) => {
  const p = Number(price) || 0;
  const d = Number(discount) || 0;
  return p > 0 && p > d ? Math.round(((p - d) / p) * 100) : 0;
};

export const FREE_DELIVERY_THRESHOLD = 499;
export const DELIVERY_CHARGE = 49;
export const deliveryFor = (subtotal: number | undefined | null) => {
  const s = Number(subtotal) || 0;
  return s === 0 || s >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
};

export const LOW_STOCK = 10;

export const ORDER_STAGES: OrderStatus[] = ['Placed', 'Packed', 'Shipped', 'Delivered'];

export const CATEGORIES: { key: Category; label: string; path: string; image: string; blurb: string }[] = [
  {
    key: 'podi',
    label: 'Podi Varieties',
    path: '/podi',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=80',
    blurb: 'Traditional roasted lentil and spice powders (100 g)',
  },
  {
    key: 'snacks',
    label: 'Snacks',
    path: '/snacks',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
    blurb: 'Handcrafted crunchy South Indian snacks (1 kg)',
  },
  {
    key: 'sweets',
    label: 'Sweets',
    path: '/sweets',
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=700&q=80',
    blurb: 'Traditional festival and ghee-rich sweets (1 kg)',
  },
  {
    key: 'additional_snacks',
    label: 'Additional Snacks',
    path: '/additional-snacks',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
    blurb: 'Crispy namkeens & quick tea-time bites (250 g)',
  },
];

export const categoryLabel = (c: Category) => CATEGORIES.find((x) => x.key === c)?.label ?? c;

export const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2, 10);

export const generateOrderId = () => {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `SHP-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const statusColor = (s: OrderStatus) =>
  ({ Placed: '#E6A044', Packed: '#6B8FD6', Shipped: '#568C3C', Delivered: '#194D35' })[s] ?? '#194D35';
