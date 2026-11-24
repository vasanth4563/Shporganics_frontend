import { Box, Button, Stack } from '@mui/material';
import { CheckCircle2, Clock, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Panel from '../../../components/common/Panel';
import { StatCard } from '../../../components/common';
import { OrderDetailsDialog } from '../../../components/orders/OrderComponents';
import { ProductGrid } from '../../../components/products/ProductCard';
import { brand } from '../../../theme/theme';
import { useAuth, useCart, useOrders, useProducts } from '../../../hooks';
import type { Order } from '../../../types';
import WelcomeBanner from './WelcomeBanner';
import RecentOrders from './RecentOrders';
import OrderStatusSummary from './OrderStatusSummary';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { ordersFor } = useOrders();
  const { count } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<Order | null>(null);

  const mine = user ? ordersFor(user.id) : [];
  const pending = mine.filter((o) => o.status !== 'Delivered').length;
  const delivered = mine.length - pending;
  const recommended = [...products].filter((p) => p.stock > 0).sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 1200, mx: 'auto', boxSizing: 'border-box', alignItems: 'stretch', minWidth: 0 }}>
      <WelcomeBanner name={user?.name} />

      {/* 4 Stat Cards: Perfect CSS Grid, 2 columns on mobile, 4 columns on desktop, 100% symmetric width */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
          gap: { xs: 1.5, sm: 2.5 },
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
        }}
      >
        <StatCard label="Total orders" value={mine.length} icon={ShoppingBag} />
        <StatCard label="Pending orders" value={pending} icon={Clock} tint={brand.orange} />
        <StatCard label="Delivered" value={delivered} icon={CheckCircle2} tint={brand.leaf} />
        <StatCard label="Cart items" value={count} icon={ShoppingCart} tint="#6B8FD6" />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.4fr) minmax(0, 1fr)' },
          gap: { xs: 2, sm: 2.5 },
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          alignItems: 'stretch',
        }}
      >
        <RecentOrders orders={mine} onSelect={setDetail} />
        <OrderStatusSummary orders={mine} />
      </Box>

      <Panel title="Recommended for you" action={<Button size="small" onClick={() => navigate('/buyer/browse')}>Browse all</Button>}>
        <ProductGrid products={recommended} cols={3} />
      </Panel>
      <OrderDetailsDialog order={detail} onClose={() => setDetail(null)} onTrack={(o) => navigate(`/buyer/track?id=${o.id}`)} />
    </Stack>
  );
};

export default BuyerDashboard;
