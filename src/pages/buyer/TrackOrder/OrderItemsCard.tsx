import { Box, Stack, Typography } from '@mui/material';
import { SmartImage } from '../../../components/common';
import { formatPrice } from '../../../utils/format';
import type { Order } from '../../../types';

interface OrderItemsCardProps {
  order: Order;
}

const OrderItemsCard = ({ order }: OrderItemsCardProps) => {
  return (
    <Box sx={{ p: 2.5, borderRadius: 4, bgcolor: '#FBF8F1' }}>
      <Typography fontWeight={600} sx={{ mb: 1.5 }}>Items</Typography>
      <Stack spacing={1.5}>
        {order.items.map((i) => (
          <Stack key={i.productId} direction="row" spacing={1.5} alignItems="center">
            <SmartImage src={i.image} alt={i.name} sx={{ width: 46, height: 46, borderRadius: 2 }} />
            <Typography sx={{ flexGrow: 1 }} fontSize={14.5}>{i.name} <Typography component="span" color="text.secondary" fontSize={13}>× {i.quantity}</Typography></Typography>
            <Typography fontWeight={600}>{formatPrice(i.price * i.quantity)}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default OrderItemsCard;
