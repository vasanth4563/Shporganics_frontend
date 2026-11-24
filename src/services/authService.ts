import { api, TOKEN_KEY, Url } from './api';
import type { Role, SessionUser } from '../types';
import { userService } from './mockServices';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  role: Role;
  user: {
    id: number | string;
    name: string;
    email: string;
    phone?: string | null;
    role: Role;
    is_active: boolean;
    created_at: string;
  };
}

export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}

export const authService = {
  /**
   * Log in user against FastAPI backend.
   * Falls back to mock database if backend server is not running.
   */
  async login(
    email: string,
    password: string,
    role?: Role
  ): Promise<{ ok: true; user: SessionUser; token?: string } | { ok: false; error: string }> {
    try {
      const res = await api.post<AuthResponse>(Url.login, {
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      if (res.data?.access_token) {
        localStorage.setItem(TOKEN_KEY, res.data.access_token);
        const s: SessionUser = {
          id: String(res.data.user.id),
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone || '',
          role: res.data.role,
        };
        return { ok: true, user: s, token: res.data.access_token };
      }
      return { ok: false, error: 'Login failed: No token received.' };
    } catch (err: any) {
      // If backend responded with an error message (e.g. 401, 403, 400)
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        const msg = typeof detail === 'string' ? detail : detail[0]?.msg || 'Authentication failed.';
        return { ok: false, error: msg };
      }

      // If backend is not running (Network Error / connection refused), fall back to mock service
      console.warn('Backend API unreachable, falling back to local demo mock:', err.message);
      const found = userService.getAll().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) return { ok: false, error: 'No account found with this email.' };
      if (found.password !== password) return { ok: false, error: 'Incorrect password.' };

      const s: SessionUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone || '',
        role: found.role,
        address: found.address,
      };
      return { ok: true, user: s };
    }
  },

  /**
   * Register user with FastAPI backend.
   */
  async register(
    data: SignupPayload
  ): Promise<{ ok: true; user?: SessionUser; token?: string } | { ok: false; error: string }> {
    try {
      const res = await api.post<AuthResponse>(Url.register, {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        password: data.password,
        role: data.role,
      });

      if (res.data?.access_token) {
        localStorage.setItem(TOKEN_KEY, res.data.access_token);
        const s: SessionUser = {
          id: String(res.data.user.id),
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone || '',
          role: res.data.role,
        };
        return { ok: true, user: s, token: res.data.access_token };
      }
      return { ok: true };
    } catch (err: any) {
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        const msg = typeof detail === 'string' ? detail : detail[0]?.msg || 'Registration failed.';
        return { ok: false, error: msg };
      }

      // Fallback to local storage mock if backend is down
      console.warn('Backend API unreachable, falling back to local demo mock:', err.message);
      const users = userService.getAll();
      if (users.some((u) => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
        return { ok: false, error: 'An account with this email already exists.' };
      }
      userService.saveAll([
        ...users,
        {
          ...data,
          email: data.email.trim(),
          id: `u-${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
      ]);
      return { ok: true };
    }
  },

  /**
   * Fetch currently authenticated user via access token.
   */
  async getMe(): Promise<SessionUser | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const res = await api.get(Url.me);
      if (res.data) {
        return {
          id: String(res.data.id),
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone || '',
          role: res.data.role,
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },
};
