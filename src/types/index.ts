export type Role = 'buyer' | 'seller';

export type Category = 'podi' | 'snacks' | 'sweets' | 'additional_snacks';

export type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Delivered';

export type PaymentMode = 'Cash on Delivery' | 'UPI' | 'Card / Net Banking' | string;

export interface Product {
  id: string;
  name: string;
  category: Category;
  subCategory: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  image: string;
  weight: string;
  rating: number;
  sold: number;
  featured?: boolean;
  bestSeller?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type AddressType = 'Home' | 'Work' | 'Other';

export interface Address {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface SavedAddress extends Address {
  id: string;
  name?: string;
  phone?: string;
  type?: AddressType;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  address?: Address;
  createdAt: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  address?: Address;
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderHistoryStep {
  status: OrderStatus;
  date: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  email: string;
  phone: string;
  shipping: Address;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  paymentMode: PaymentMode;
  status: OrderStatus;
  createdAt: string;
  history: OrderHistoryStep[];
}
