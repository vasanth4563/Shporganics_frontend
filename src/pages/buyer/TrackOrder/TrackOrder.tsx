import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Truck } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Panel from '../../../components/common/Panel';
import { EmptyState, StatusChip } from '../../../components/common';
import { OrderTracker } from '../../../components/orders/OrderComponents';
import { brand } from '../../../theme/theme';
import { formatDate } from '../../../utils/format';
import { useAuth, useOrders } from '../../../hooks';
import OrderPlacedBanner from './OrderPlacedBanner';
import OrderItemsCard from './OrderItemsCard';
import DeliveryAddressCard from './DeliveryAddressCard';

const TrackOrder = () => {
  const { user } = useAuth();
  const { ordersFor } = useOrders();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { justPlaced?: boolean } };
  const [params, setParams] = useSearchParams();

  const mine = user ? ordersFor(user.id) : [];
  const id = params.get('id') ?? mine[0]?.id ?? '';
  const order = mine.find((o) => o.id === id);

  if (!mine.length)
    return <Panel title="Track order"><EmptyState icon={Truck} title="No orders to track" message="Place an order to follow its journey here." action={<Button variant="contained" onClick={() => navigate('/buyer/browse')}>Shop now</Button>} /></Panel>;

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      {location.state?.justPlaced && order?.id === id && <OrderPlacedBanner orderId={id} />}
      <Panel title="Track your order" action={
        <TextField select size="small" value={id} onChange={(e) => setParams({ id: e.target.value })} sx={{ minWidth: { xs: 160, sm: 240 } }} id="track-select">
          {mine.map((o) => <MenuItem key={o.id} value={o.id}>{o.id}</MenuItem>)}
        </TextField>
      }>
        {order ? (
          <>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} sx={{ mb: 4 }}>
              <Box>
                <Typography color="text.secondary" fontSize={13.5}>Order placed {formatDate(order.createdAt)}</Typography>
                <Typography variant="h5" sx={{ color: brand.green }}>{order.status === 'Delivered' ? 'Delivered — enjoy!' : `Currently ${order.status.toLowerCase()}`}</Typography>
              </Box>
              <Box><StatusChip status={order.status} /></Box>
            </Stack>
            <Box sx={{ px: { xs: 0, md: 4 }, mb: 4 }}><OrderTracker order={order} /></Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 2.5, width: '100%' }}>
              <OrderItemsCard order={order} />
              <DeliveryAddressCard order={order} />
            </Box>
          </>
        ) : <EmptyState title="Order not found" message="Select an order from the dropdown." />}
      </Panel>
    </Stack>
  );
};

export default TrackOrder;
