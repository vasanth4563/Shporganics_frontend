import { Box, Button, Stack, Typography } from '@mui/material';
import { SmartImage, StatusChip } from '../../../components/common';
import { brand } from '../../../theme/theme';
import { formatDate, formatPrice } from '../../../utils/format';
import type { Order } from '../../../types';

interface OrderCardListProps {
  orders: Order[];
  onDetails: (order: Order) => void;
  onTrack: (order: Order) => void;
}

/** Mobile View: Clean Card-based List */
const OrderCardList = ({ orders, onDetails, onTrack }: OrderCardListProps) => {
  return (
    <Stack spacing={1.5} sx={{ display: { xs: 'flex', md: 'none' } }}>
      {orders.map((o) => (
        <Box
          key={o.id}
          sx={{
            p: 2,
            borderRadius: 3.5,
            border: `1px solid ${brand.line}`,
            bgcolor: '#FAF7F0',
            transition: 'all 0.2s',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Box>
              <Typography fontWeight={700} fontSize={14.5} color={brand.green}>{o.id}</Typography>
              <Typography fontSize={12} color="text.secondary">{formatDate(o.createdAt)}</Typography>
            </Box>
            <StatusChip status={o.status} />
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ my: 1.5, p: 1.2, bgcolor: '#fff', borderRadius: 2.5 }}>
            <SmartImage src={o.items[0]?.image} alt="" sx={{ width: 44, height: 44, borderRadius: 2 }} />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography fontSize={13.5} fontWeight={600} noWrap>
                {o.items[0]?.name}{o.items.length > 1 ? ` +${o.items.length - 1} more` : ''}
              </Typography>
              <Typography fontSize={12} color="text.secondary">{o.items.length} item{o.items.length > 1 ? 's' : ''} · {o.paymentMode}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
            <Typography fontWeight={700} fontSize={16} color={brand.green}>{formatPrice(o.total)}</Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" onClick={() => onDetails(o)} sx={{ borderRadius: 999, fontSize: 12 }}>Details</Button>
              <Button size="small" variant="contained" onClick={() => onTrack(o)} sx={{ borderRadius: 999, fontSize: 12 }}>Track</Button>
            </Stack>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default OrderCardList;
