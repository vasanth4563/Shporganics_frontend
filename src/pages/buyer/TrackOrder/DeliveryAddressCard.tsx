import { Box, Stack, Typography } from '@mui/material';
import { brand } from '../../../theme/theme';
import { formatPrice } from '../../../utils/format';
import type { Order } from '../../../types';

interface DeliveryAddressCardProps {
  order: Order;
}

const DeliveryAddressCard = ({ order }: DeliveryAddressCardProps) => {
  return (
    <Box sx={{ p: 2.5, borderRadius: 4, bgcolor: '#FBF8F1', height: '100%' }}>
      <Typography fontWeight={600} sx={{ mb: 1 }}>Delivery address</Typography>
      <Typography fontSize={14} color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {order.buyerName}<br />{order.shipping.address}<br />{order.shipping.city}, {order.shipping.state} – {order.shipping.pincode}<br />{order.phone}
      </Typography>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, pt: 2, borderTop: `1px dashed ${brand.line}` }}>
        <Typography fontSize={14}>{order.paymentMode}</Typography>
        <Typography fontWeight={700} color={brand.green}>{formatPrice(order.total)}</Typography>
      </Stack>
    </Box>
  );
};

export default DeliveryAddressCard;
