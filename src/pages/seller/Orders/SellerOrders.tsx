import {
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { StatusChip } from '../../../components/common';
import { OrderDetailsDialog } from '../../../components/orders/OrderComponents';
import { brand } from '../../../theme/theme';
import { formatDate, formatPrice, ORDER_STAGES } from '../../../utils/format';
import { useOrders, useToast } from '../../../hooks';
import type { Order, OrderStatus } from '../../../types';
import SellerPanel from '../shared/SellerPanel';

/* =========================================================================
   4. ORDERS RECEIVED (STATUS UPDATER)
   ========================================================================= */
const SellerOrders = () => {
  const { orders, updateStatus } = useOrders();
  const { notify } = useToast();
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    updateStatus(orderId, nextStatus);
    notify(`Order ${orderId} marked as ${nextStatus}`);
  };

  return (
    <SellerPanel
      title="Orders Received"
      subtitle="Track customer orders and advance shipping stages in real-time"
    >
      <TableContainer>
        <Table sx={{ minWidth: 950 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Buyer Info</TableCell>
              <TableCell>Delivery Address</TableCell>
              <TableCell>Items Ordered</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Update Stage</TableCell>
              <TableCell align="right">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>
                  {o.id}
                  <Typography fontSize={11.5} color="text.secondary">
                    {formatDate(o.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} fontSize={14}>
                    {o.buyerName}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {o.phone}
                  </Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 220 }}>
                  <Typography fontSize={12.5} color="text.secondary">
                    {o.shipping.address}, {o.shipping.city} - {o.shipping.pincode}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={13}>
                    {o.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: brand.green }}>{formatPrice(o.total)}</TableCell>
                <TableCell>
                  <Typography fontSize={13}>{o.paymentMode}</Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={o.status} />
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                    sx={{ minWidth: 130 }}
                  >
                    {ORDER_STAGES.map((stage) => (
                      <MenuItem key={stage} value={stage}>
                        {stage}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setDetailOrder(o)}>
                    <Eye size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <OrderDetailsDialog order={detailOrder} onClose={() => setDetailOrder(null)} />
    </SellerPanel>
  );
};

export default SellerOrders;
