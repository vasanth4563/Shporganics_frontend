import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { brand } from '../../../theme/theme';

interface WelcomeBannerProps {
  name?: string;
}

const WelcomeBanner = ({ name }: WelcomeBannerProps) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 }, borderRadius: { xs: '20px', sm: '24px' }, color: '#fff', position: 'relative', overflow: 'hidden', background: `linear-gradient(120deg, ${brand.green}, ${brand.leaf})`, boxShadow: '0 8px 24px rgba(25, 77, 53, 0.12)', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      <Box sx={{ position: 'absolute', right: -40, top: -60, width: 260, height: 260, borderRadius: '50%', bgcolor: 'rgba(255,255,255,.08)' }} />
      <Typography sx={{ opacity: .8, fontSize: { xs: 13, sm: 14 } }}>Good to see you,</Typography>
      <Typography variant="h3" sx={{ fontSize: { xs: 26, sm: 32, md: 36 } }}>{name ? name.split(' ')[0] : 'Friend'} 👋</Typography>
      <Typography sx={{ opacity: .85, mt: 1, maxWidth: 520, fontSize: { xs: 13.5, sm: 15 } }}>Fresh batches of jaggery laddus and Lakadong turmeric just landed. Treat yourself today.</Typography>
      <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }} flexWrap="wrap" useFlexGap>
        <Button variant="contained" onClick={() => navigate('/buyer/browse')} sx={{ bgcolor: '#fff', color: brand.green, borderRadius: 999, px: 2.5, py: 0.8, fontSize: 13, '&:hover': { bgcolor: brand.cream } }}>Shop now</Button>
        <Button variant="outlined" onClick={() => navigate('/buyer/track')} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)', borderRadius: 999, px: 2.5, py: 0.8, fontSize: 13, '&:hover': { borderColor: '#fff' } }}>Track an order</Button>
      </Stack>
    </Box>
  );
};

export default WelcomeBanner;
