import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { SmartImage, StatusChip } from '../../../components/common';
import { formatDate, formatPrice } from '../../../utils/format';
import type { Order } from '../../../types';

interface OrdersTableProps {
  orders: Order[];
  onDetails: (order: Order) => void;
  onTrack: (order: Order) => void;
}

/** Desktop View: Full Data Table */
const OrdersTable = ({ orders, onDetails, onTrack }: OrdersTableProps) => {
  return (
    <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
      <Table sx={{ minWidth: 820 }}>
        <TableHead>
          <TableRow>
            {['Order ID', 'Date', 'Products', 'Total', 'Payment', 'Status', ''].map((h) => <TableCell key={h}>{h}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id} hover>
              <TableCell sx={{ fontWeight: 600 }}>{o.id}</TableCell>
              <TableCell>{formatDate(o.createdAt)}</TableCell>
              <TableCell sx={{ maxWidth: 260 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SmartImage src={o.items[0].image} alt="" sx={{ width: 36, height: 36, borderRadius: 2 }} />
                  <Typography fontSize={14} noWrap>{o.items[0].name}{o.items.length > 1 && ` +${o.items.length - 1} more`}</Typography>
                </Stack>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{formatPrice(o.total)}</TableCell>
              <TableCell>{o.paymentMode}</TableCell>
              <TableCell><StatusChip status={o.status} /></TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button size="small" variant="outlined" onClick={() => onDetails(o)}>View details</Button>
                  <Button size="small" onClick={() => onTrack(o)}>Track</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
