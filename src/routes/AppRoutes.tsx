import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  Boxes,
  ClipboardList,
  Layers,
  LayoutDashboard,
  PackageCheck,
  ShoppingBag,
  Truck,
  User,
  Users,
} from "lucide-react";
import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import Home from "../pages/public/Home";
import { CategoryPage, SearchPage } from "../pages/public/CategoryPage";
import { Contact } from "../pages/public/Misc";
import { Login, Signup } from "../pages/auth/AuthPages";
import { CartPage, CheckoutPage } from "../pages/buyer/CartCheckout";
import {
  BrowseProducts,
  BuyerDashboard,
  BuyerProfile,
  MyOrders,
  TrackOrder,
} from "../pages/buyer/BuyerPages";
import {
  BuyerDetails,
  ManageStock,
  SellerDashboard,
  SellerOrders,
  SellerProducts,
} from "../pages/seller/SellerPages";
import { useAuth } from "../hooks";
import type { Role } from "../types";

/**
 * Root entry route: Ensures the Login page is ALWAYS shown first when opening the app.
 * If user is already logged in, redirects directly to their role-based dashboard.
 */
function RootRoute() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Navigate to={user.role === "seller" ? "/seller" : "/buyer"} replace />
  );
}

/** Role-based Protected Route wrapper */
function ProtectedRoute({
  allowedRole,
  children,
}: {
  allowedRole: Role;
  children: React.ReactElement;
}) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== allowedRole) {
    return (
      <Navigate to={user.role === "seller" ? "/seller" : "/buyer"} replace />
    );
  }

  return children;
}

const buyerNavItems = [
  { label: "Dashboard", to: "/buyer", icon: LayoutDashboard, end: true },
  { label: "Browse Products", to: "/buyer/browse", icon: ShoppingBag },
  { label: "My Orders", to: "/buyer/orders", icon: PackageCheck },
  { label: "Track Order", to: "/buyer/track", icon: Truck },
  { label: "My Profile", to: "/buyer/profile", icon: User },
];

const sellerNavItems = [
  { label: "Dashboard", to: "/seller", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/seller/products", icon: Boxes },
  { label: "Manage Stock", to: "/seller/stock", icon: Layers },
  { label: "Orders Received", to: "/seller/orders", icon: ClipboardList },
  { label: "Buyer Details", to: "/seller/buyers", icon: Users },
];

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root Route: Always opens Login page first if not logged in */}
      <Route path="/" element={<RootRoute />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Store Showcase Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/store" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/podi" element={<CategoryPage category="podi" />} />
        <Route path="/snacks" element={<CategoryPage category="snacks" />} />
        <Route path="/sweets" element={<CategoryPage category="sweets" />} />
        <Route
          path="/additional-snacks"
          element={<CategoryPage category="additional_snacks" />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>

      {/* Buyer Dashboard Experience */}
      <Route
        path="/buyer"
        element={
          <ProtectedRoute allowedRole="buyer">
            <DashboardLayout items={buyerNavItems} title="Buyer Portal" />
          </ProtectedRoute>
        }
      >
        <Route index element={<BuyerDashboard />} />
        <Route path="browse" element={<BrowseProducts />} />
        <Route path="cart" element={<CartPage dashboard />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="track" element={<TrackOrder />} />
        <Route path="profile" element={<BuyerProfile />} />
      </Route>

      {/* Seller Dashboard Experience */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRole="seller">
            <DashboardLayout items={sellerNavItems} title="Seller Admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="add-product" element={<SellerProducts />} />
        <Route path="stock" element={<ManageStock />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="buyers" element={<BuyerDetails />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<RootRoute />} />
    </Routes>
  );
}
