import { api, Url } from './api';
import type { Order, Product, User } from '../types';
import { normalizeProduct } from './mockServices';

export interface MonthlyStat {
  month: string;
  sales: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalBuyers: number;
  lowStockItems: number;
  topSellingProducts: Product[];
  monthlyStats: MonthlyStat[];
}

export interface TotalRevenueResponse {
  totalRevenue: number;
  currency: string;
  formatted: string;
}

export interface TotalProductsResponse {
  count: number;
  products: Product[];
}

export interface TotalOrdersResponse {
  count: number;
  orders: Order[];
}

export interface PendingOrdersResponse {
  count: number;
  orders: Order[];
}

export interface TotalBuyersResponse {
  count: number;
  buyers: User[];
}

export interface RegisteredBuyer {
  id: number | string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  address?: string | null;
  totalOrders: number;
  totalSpent: number;
  recentPurchase?: {
    id: string;
    date: string;
    total: number;
    status: string;
  } | null;
}

export interface RegisteredBuyersResponse {
  count: number;
  buyers: RegisteredBuyer[];
}

export interface LowStockResponse {
  count: number;
  threshold: number;
  products: Product[];
}

export interface TopSellingResponse {
  count: number;
  products: Product[];
}

export interface SalesOverviewResponse {
  totalRevenue: number;
  monthlyStats: MonthlyStat[];
}

export const sellerService = {
  /**
   * Fetch all 6 main dashboard cards & charts in a single high-performance API call.
   */
  getStats: async (): Promise<DashboardStats | null> => {
    try {
      const res = await api.get<any>(Url.sellerStats);
      if (res.data) {
        const d = res.data;
        return {
          totalRevenue: Number(d.total_revenue ?? d.totalRevenue ?? 0),
          totalProducts: Number(d.total_products ?? d.totalProducts ?? 0),
          totalOrders: Number(d.total_orders ?? d.totalOrders ?? 0),
          pendingOrders: Number(d.pending_orders ?? d.pendingOrders ?? 0),
          totalBuyers: Number(d.total_buyers ?? d.totalBuyers ?? 0),
          lowStockItems: Number(d.low_stock_items ?? d.lowStockItems ?? 0),
          topSellingProducts: Array.isArray(d.top_selling_products)
            ? d.top_selling_products.map(normalizeProduct)
            : [],
          monthlyStats: Array.isArray(d.monthly_stats)
            ? d.monthly_stats.map((m: any) => ({ month: m.month, sales: Number(m.sales) }))
            : [],
        };
      }
    } catch {
      // Backend offline or unreachable; callers fall back to local context
    }
    return null;
  },

  /**
   * Dedicated API for the 'Total Revenue' card.
   */
  getTotalRevenue: async (): Promise<TotalRevenueResponse | null> => {
    try {
      const res = await api.get<any>(Url.sellerTotalRevenue);
      if (res.data) {
        return {
          totalRevenue: Number(res.data.total_revenue ?? res.data.totalRevenue ?? 0),
          currency: res.data.currency ?? 'INR',
          formatted: res.data.formatted ?? `₹${Number(res.data.total_revenue ?? 0).toLocaleString()}`,
        };
      }
    } catch {
      return null;
    }
    return null;
  },

  /**
   * Dedicated API for the 'Total Products' card.
   */
  getTotalProducts: async (includeItems = true): Promise<TotalProductsResponse | null> => {
    try {
      const res = await api.get<any>(Url.sellerTotalProducts, { params: { include_items: includeItems } });
      if (res.data) {
        return {
          count: Number(res.data.count ?? 0),
          products: Array.isArray(res.data.products) ? res.data.products.map(normalizeProduct) : [],
        };
      }
    } catch {
      return null;
    }
    return null;
  },

  /**
   * Dedicated API for the 'Total Orders' card.
   */
  getTotalOrders: async (includeOrders = true): Promise<TotalOrdersResponse | null> => {
    try {
      const res = await api.get<any>(Url.sellerTotalOrders, { params: { include_orders: includeOrders } });
      if (res.data) {
        return {
          count: Number(res.data.count ?? 0),
          orders: Array.isArray(res.data.orders) ? res.data.orders : [],
        };
      }
    } catch {
      return null;
    }
    return null;
  },

  /**
   * Dedicated API for the 'Pending Orders' card.
   */
  getPendingOrders: async (): Promise<PendingOrdersResponse | null> => {
    try {
      const res = await api.get<PendingOrdersResponse>(Url.sellerPendingOrders);
      return res.data;
    } catch {
      return null;
    }
  },

  /**
   * Dedicated API for the 'Total Buyers' card.
   */
  getTotalBuyers: async (): Promise<TotalBuyersResponse | null> => {
    try {
      const res = await api.get<TotalBuyersResponse>(Url.sellerTotalBuyers);
      return res.data;
    } catch {
      return null;
    }
  },

  /**
   * Dedicated API for 'Registered Buyers' directory with order history.
   */
  getRegisteredBuyers: async (query?: string): Promise<RegisteredBuyersResponse | null> => {
    try {
      const res = await api.get<any>(Url.sellerRegisteredBuyers, {
        params: query ? { q: query } : undefined,
      });
      if (res.data) {
        return {
          count: Number(res.data.count ?? 0),
          buyers: Array.isArray(res.data.buyers)
            ? res.data.buyers.map((b: any) => ({
                id: b.id,
                name: b.name,
                email: b.email,
                phone: b.phone,
                role: b.role,
                isActive: Boolean(b.is_active ?? b.isActive),
                createdAt: b.created_at ?? b.createdAt,
                address: b.address,
                totalOrders: Number(b.total_orders ?? b.totalOrders ?? 0),
                totalSpent: Number(b.total_spent ?? b.totalSpent ?? 0),
                recentPurchase: b.recent_purchase ?? b.recentPurchase ?? null,
              }))
            : [],
        };
      }
    } catch {
      return null;
    }
    return null;
  },

  /**
   * Dedicated API for the 'Low Stock Items' card.
   */
  getLowStockItems: async (threshold = 10): Promise<LowStockResponse | null> => {
    try {
      const res = await api.get<any>(Url.sellerLowStock, { params: { threshold } });
      if (res.data) {
        return {
          count: Number(res.data.count ?? 0),
          threshold: Number(res.data.threshold ?? threshold),
          products: Array.isArray(res.data.products) ? res.data.products.map(normalizeProduct) : [],
        };
      }
    } catch {
      return null;
    }
    return null;
  },

  /**
   * Dedicated API for the 'Top-Selling Products' card.
   */
  getTopSelling: async (limit = 5): Promise<Product[] | null> => {
    try {
      const res = await api.get<any>(Url.sellerTopSelling, { params: { limit } });
      if (res.data?.products) {
        return res.data.products.map(normalizeProduct);
      }
    } catch {
      return null;
    }
    return null;
  },

  /**
   * Dedicated API for the 'Sales Overview' card.
   */
  getSalesOverview: async (): Promise<SalesOverviewResponse | null> => {
    try {
      const res = await api.get<any>(Url.sellerSalesOverview);
      if (res.data) {
        return {
          totalRevenue: Number(res.data.total_revenue ?? res.data.totalRevenue ?? 0),
          monthlyStats: Array.isArray(res.data.monthly_stats)
            ? res.data.monthly_stats.map((m: any) => ({ month: m.month, sales: Number(m.sales) }))
            : [],
        };
      }
    } catch {
      return null;
    }
    return null;
  },
};
