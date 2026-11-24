import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  AlertTriangle,
  Boxes,
  Clock,
  DollarSign,
  Eye,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { SmartImage, StatCard, StatusChip } from '../../../components/common';
import { OrderDetailsDialog } from '../../../components/orders/OrderComponents';
import { brand } from '../../../theme/theme';
import { formatPrice, LOW_STOCK } from '../../../utils/format';
import { useAuth, useOrders, useProducts } from '../../../hooks';
import type { Order } from '../../../types';
import SellerPanel from '../shared/SellerPanel';
import { sellerService, type DashboardStats } from '../../../services/sellerService';

/* =========================================================================
   1. SELLER DASHBOARD
   ========================================================================= */
const SellerDashboard = () => {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { allUsers } = useAuth();
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [apiStats, setApiStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    let active = true;
    sellerService.getStats().then((data) => {
      if (active && data) {
        setApiStats(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const buyers = allUsers().filter((u) => u.role === 'buyer');
  const pendingOrders = orders.filter((o) => o.status !== 'Delivered');
  const lowStockProducts = products.filter((p) => p.stock <= LOW_STOCK);

  const totalRevenue = apiStats?.totalRevenue ?? orders.reduce((acc, o) => acc + o.total, 0);
  const totalProductsCount = apiStats?.totalProducts ?? products.length;
  const totalOrdersCount = apiStats?.totalOrders ?? orders.length;
  const pendingOrdersCount = apiStats?.pendingOrders ?? pendingOrders.length;
  const totalBuyersCount = apiStats?.totalBuyers ?? buyers.length;
  const lowStockCount = apiStats?.lowStockItems ?? lowStockProducts.length;

  // Top selling products sorted by 'sold'
  const topProducts = useMemo(() => {
    if (apiStats?.topSellingProducts && apiStats.topSellingProducts.length > 0) {
      return apiStats.topSellingProducts;
    }
    return [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  }, [products, apiStats]);

  // Monthly revenue data for visualization
  const monthlyStats = useMemo(() => {
    if (apiStats?.monthlyStats && apiStats.monthlyStats.length > 0) {
      return apiStats.monthlyStats;
    }
    return [
      { month: 'Jun', sales: 42000 },
      { month: 'Jul', sales: 68000 },
      { month: 'Aug', sales: 84000 },
      { month: 'Sep', sales: 95000 },
      { month: 'Oct', sales: 128000 },
      { month: 'Nov', sales: 146000 },
    ];
  }, [apiStats]);

  const maxSales = Math.max(...monthlyStats.map((s) => s.sales));

  return (
    <Stack spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      {/* Overview Stat Cards - Responsive Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(3, minmax(0, 1fr))',
            md: 'repeat(6, minmax(0, 1fr))',
          },
          gap: { xs: 1.5, sm: 2.5 },
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
        }}
      >
        <StatCard label="Total Revenue" value={formatPrice(totalRevenue)} icon={DollarSign} tint={brand.green} />
        <StatCard label="Total Products" value={totalProductsCount} icon={Boxes} tint="#3B82F6" />
        <StatCard label="Total Orders" value={totalOrdersCount} icon={ShoppingBag} tint="#8B5CF6" />
        <StatCard label="Pending Orders" value={pendingOrdersCount} icon={Clock} tint={brand.orange} />
        <StatCard label="Total Buyers" value={totalBuyersCount} icon={Users} tint="#10B981" />
        <StatCard label="Low Stock Items" value={lowStockCount} icon={AlertTriangle} tint="#EF4444" />
      </Box>

      {/* Sales Overview Chart & Stock Summary */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 2fr) minmax(0, 1fr)' },
          gap: { xs: 2, sm: 3 },
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <SellerPanel title="Sales Overview" subtitle="Monthly gross revenue performance (INR)">
            <Box sx={{ pt: 2, pb: 1, width: '100%', minWidth: 0, overflowX: 'auto' }}>
              <Stack
                direction="row"
                spacing={{ xs: 1, sm: 2.5 }}
                alignItems="flex-end"
                sx={{
                  height: 210,
                  px: { xs: 0.5, sm: 1.5 },
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                }}
              >
                {monthlyStats.map((item) => {
                  const barHeight = Math.round((item.sales / maxSales) * 160);
                  return (
                    <Stack key={item.month} alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        fontSize={{ xs: 9.5, sm: 11.5 }}
                        fontWeight={600}
                        color={brand.green}
                        noWrap
                        sx={{ textAlign: 'center', width: '100%' }}
                      >
                        {formatPrice(item.sales)}
                      </Typography>
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: { xs: 36, sm: 48 },
                          height: barHeight,
                          borderRadius: '8px 8px 3px 3px',
                          background: `linear-gradient(180deg, ${brand.leaf} 0%, ${brand.green} 100%)`,
                          transition: 'all 0.3s ease',
                          '&:hover': { background: brand.orange, transform: 'scaleY(1.04)' },
                        }}
                      />
                      <Typography fontSize={{ xs: 11.5, sm: 13 }} color="text.secondary" fontWeight={500}>
                        {item.month}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          </SellerPanel>
        </Box>

        <Box sx={{ width: '100%', minWidth: 0 }}>
          <SellerPanel title="Top-Selling Products" subtitle="By total units dispatched">
            <Stack spacing={2} sx={{ mt: 1 }}>
              {topProducts.map((p, index) => (
                <Stack key={p.id} direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: index === 0 ? brand.orange : brand.cream,
                      color: index === 0 ? '#fff' : brand.green,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <SmartImage src={p.image} alt={p.name} sx={{ width: 40, height: 40, borderRadius: 2, flexShrink: 0 }} />
                  <Box sx={{ flex: '1 1 0%', minWidth: 0, overflow: 'hidden' }}>
                    <Typography fontSize={13.5} fontWeight={600} noWrap>
                      {p.name}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {formatPrice(p.discountPrice)} · {p.weight}
                    </Typography>
                  </Box>
                  <Typography fontSize={13} fontWeight={700} color={brand.green}>
                    {p.sold} sold
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </SellerPanel>
        </Box>
      </Box>

      {/* Recent Orders Table */}
      <SellerPanel title="Recent Orders" subtitle="Latest incoming orders across all buyers">
        <TableContainer sx={{ width: '100%', minWidth: 0, overflowX: 'auto' }}>
          <Table sx={{ minWidth: { xs: 600, sm: 700 } }}>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(0, 5).map((o) => (
                <TableRow key={o.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{o.id}</TableCell>
                  <TableCell>
                    <Typography fontSize={14} fontWeight={600}>
                      {o.buyerName}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {o.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={13.5}>
                      {o.items.map((i) => i.name).join(', ')} ({o.items.reduce((s, i) => s + i.quantity, 0)} items)
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{formatPrice(o.total)}</TableCell>
                  <TableCell>
                    <StatusChip status={o.status} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setDetailOrder(o)} aria-label="view order">
                      <Eye size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SellerPanel>

      <OrderDetailsDialog order={detailOrder} onClose={() => setDetailOrder(null)} />
    </Stack>
  );
};

export default SellerDashboard;
