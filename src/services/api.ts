import axios from 'axios';

export const TOKEN_KEY = 'token';

/**
 * Endpoints dictionary for clean and centralized URL access.
 */
export const Url = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  me: '/api/auth/me',
  products: '/api/products',
  orders: '/api/orders',
  buyerDashboard: '/api/buyer/dashboard',
  sellerDashboard: '/api/seller/dashboard',
  sellerStats: '/api/seller/stats',
  sellerTotalRevenue: '/api/seller/total-revenue',
  sellerTotalProducts: '/api/seller/total-products',
  sellerTotalOrders: '/api/seller/total-orders',
  sellerPendingOrders: '/api/seller/pending-orders',
  sellerTotalBuyers: '/api/seller/total-buyers',
  sellerRegisteredBuyers: '/api/seller/registered-buyers',
  sellerLowStock: '/api/seller/low-stock-items',
  sellerTopSelling: '/api/seller/top-selling',
  sellerSalesOverview: '/api/seller/sales-overview',
};

/**
 * Axios instance configured for SHP Organics backend API.
 * Automatically injects JWT Bearer token into outgoing requests.
 */
export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, ''),
  // Render free instances can take ~50s to wake up from sleep
  timeout: 60000,
});

// Attach Authorization header if access token exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('shp_access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user_id');
      localStorage.removeItem('shp_access_token');
    }
    return Promise.reject(error);
  }
);

/** Simulates network latency for mock services. */
export const mockDelay = <T,>(data: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));
