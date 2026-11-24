import { Avatar, Box, Typography } from '@mui/material';
import { brand } from '../../../theme/theme';
import { formatPrice } from '../../../utils/format';

interface ProfileSummaryCardProps {
  name?: string;
  email?: string;
  orderCount: number;
  totalSpent: number;
}

const ProfileSummaryCard = ({ name, email, orderCount, totalSpent }: ProfileSummaryCardProps) => {
  return (
    <Box sx={{ p: { xs: 3, sm: 4 }, bgcolor: '#fff', borderRadius: 5, border: `1px solid ${brand.line}`, textAlign: 'center', height: 'fit-content' }}>
      <Avatar sx={{ width: 96, height: 96, mx: 'auto', bgcolor: brand.green, fontSize: 38, fontFamily: '"Fraunces", serif' }}>{name?.[0] || 'U'}</Avatar>
      <Typography variant="h5" sx={{ mt: 2 }}>{name || 'Organic Customer'}</Typography>
      <Typography color="text.secondary" fontSize={14}>{email || ''}</Typography>
      <Box sx={{ display: 'inline-block', mt: 1.5, px: 1.5, py: .4, borderRadius: 999, bgcolor: brand.cream, color: brand.green, fontSize: 12.5, fontWeight: 600 }}>Organic Member</Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 3, pt: 3, borderTop: `1px solid ${brand.line}` }}>
        <Box><Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: 26, fontWeight: 600 }}>{orderCount}</Typography><Typography fontSize={13} color="text.secondary">Orders</Typography></Box>
        <Box><Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: 26, fontWeight: 600 }}>{formatPrice(totalSpent)}</Typography><Typography fontSize={13} color="text.secondary">Spent</Typography></Box>
      </Box>
    </Box>
  );
};

export default ProfileSummaryCard;
