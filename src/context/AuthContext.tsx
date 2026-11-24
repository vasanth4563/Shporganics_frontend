import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Role, SessionUser, User } from '../types';
import { KEYS, load, remove, save } from '../utils/storage';
import { userService } from '../services/mockServices';
import { authService, type SignupPayload } from '../services/authService';

interface SignupInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}

interface AuthCtx {
  user: SessionUser | null;
  login: (email: string, password: string, role?: Role) => Promise<{ ok: true; user: SessionUser } | { ok: false; error: string }>;
  signup: (data: SignupInput) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (patch: Partial<SessionUser>) => void;
  syncUserSession: (user: SessionUser) => void;
  allUsers: () => User[];
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => {
    const raw = load<SessionUser | null>(KEYS.session, null);
    if (raw && typeof raw === 'object' && raw.id && raw.name) return raw;

    const token = localStorage.getItem('token') || localStorage.getItem('shp_access_token');
    const role = localStorage.getItem('role') as Role | null;
    const userId = localStorage.getItem('user_id');
    if (token && role && userId) {
      return { id: userId, name: role === 'seller' ? 'Demo Seller' : 'Demo Buyer', email: '', role };
    }
    return null;
  });

  // Verify access token with backend on mount
  useEffect(() => {
    let isMounted = true;
    authService.getMe().then((backendUser) => {
      if (isMounted && backendUser) {
        setUser((prev) => {
          const merged = { ...prev, ...backendUser };
          save(KEYS.session, merged);
          return merged;
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const syncUserSession = useCallback((sessionUser: SessionUser) => {
    save(KEYS.session, sessionUser);
    setUser(sessionUser);
  }, []);

  const login: AuthCtx['login'] = useCallback(async (email, password, role) => {
    const res = await authService.login(email, password, role);
    if (!res.ok) return res;

    save(KEYS.session, res.user);
    setUser(res.user);
    return { ok: true, user: res.user };
  }, []);

  const signup: AuthCtx['signup'] = useCallback(async (data: SignupPayload) => {
    const res = await authService.register(data);
    if (!res.ok) return { ok: false, error: res.error };
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('shp_access_token');
    authService.logout();
    remove(KEYS.session);
    setUser(null);
  }, []);

  const updateProfile = useCallback((patch: Partial<SessionUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      save(KEYS.session, next);
      userService.saveAll(userService.getAll().map((u) => (u.id === prev.id ? { ...u, ...patch } : u)));
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ user, login, signup, logout, updateProfile, syncUserSession, allUsers: userService.getAll }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be inside AuthProvider');
  return c;
};
