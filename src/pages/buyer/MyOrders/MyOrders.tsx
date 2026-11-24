import { Box, Button, LinearProgress, MenuItem, TextField } from '@mui/material';
import { PackageCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Panel from '../../../components/common/Panel';
import { EmptyState } from '../../../components/common';
import { OrderDetailsDialog } from '../../../components/orders/OrderComponents';
import { ORDER_STAGES } from '../../../utils/format';
import { useAuth, useOrders } from '../../../hooks';
import type { Order } from '../../../types';
import OrderCardList from './OrderCardList';
import OrdersTable from './OrdersTable';

const MyOrders = () => {
  const { user } = useAuth();
  const { ordersFor, loading } = useOrders();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<Order | null>(null);
  const [filter, setFilter] = useState('All');

  const mine = (user ? ordersFor(user.id) : []).filter((o) => filter === 'All' || o.status === filter);
  const trackOrder = (o: Order) => navigate(`/buyer/track?id=${o.id}`);

  return (
    <Box sx={{ width: '100%' }}>
      <Panel title="Order history" action={
        <TextField select size="small" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ minWidth: { xs: 120, sm: 150 } }} id="orders-filter">
          {['All', ...ORDER_STAGES].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
      }>
        {loading ? <LinearProgress /> : !mine.length ? (
          <EmptyState icon={PackageCheck} title="No orders found" message="When you place an order, it'll show up here." action={<Button variant="contained" onClick={() => navigate('/buyer/browse')}>Start shopping</Button>} />
        ) : (
          <>
            <OrderCardList orders={mine} onDetails={setDetail} onTrack={trackOrder} />
            <OrdersTable orders={mine} onDetails={setDetail} onTrack={trackOrder} />
          </>
        )}
        <OrderDetailsDialog order={detail} onClose={() => setDetail(null)} onTrack={trackOrder} />
      </Panel>
    </Box>
  );
};

export default MyOrders;
