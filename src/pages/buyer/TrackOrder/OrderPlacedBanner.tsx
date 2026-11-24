import { Box, Stack, Typography } from '@mui/material';
import { PartyPopper } from 'lucide-react';
import { brand } from '../../../theme/theme';

interface OrderPlacedBannerProps {
  orderId: string;
}

const OrderPlacedBanner = ({ orderId }: OrderPlacedBannerProps) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2.5, borderRadius: 4, bgcolor: '#EEF5E9', border: `1px solid ${brand.leaf}40` }}>
      <PartyPopper color={brand.green} />
      <Box>
        <Typography fontWeight={700} color={brand.green}>Thank you! Your order has been placed.</Typography>
        <Typography fontSize={14} color="text.secondary">Order ID <b>{orderId}</b> — we'll start packing it right away.</Typography>
      </Box>
    </Stack>
  );
};

export default OrderPlacedBanner;
