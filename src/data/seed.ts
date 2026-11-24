import type { Order, User } from '../types';

/**
 * No dummy users or orders. Real accounts are created via Sign Up and
 * orders are placed by buyers – both are stored in the backend database.
 */
export const seedUsers: User[] = [];

export const seedOrders: Order[] = [];
