import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Panel from '../../../components/common/Panel';
import { brand } from '../../../theme/theme';
import { CATEGORIES, ORDER_STAGES, statusColor } from '../../../utils/format';
import type { Order } from '../../../types';

interface OrderStatusSummaryProps {
  orders: Order[];
}

const OrderStatusSummary = ({ orders }: OrderStatusSummaryProps) => {
  const navigate = useNavigate();

  return (
    <Panel title="Order status">
      <Stack spacing={1.5} sx={{ width: '100%', minWidth: 0 }}>
        {ORDER_STAGES.map((s) => {
          const n = orders.filter((o) => o.status === s).length;
          const pct = orders.length ? Math.round((n / orders.length) * 100) : 0;
          return (
            <Box key={s} sx={{ p: 1.2, px: 1.5, borderRadius: '14px', bgcolor: '#FAF7F0', border: `1px solid ${brand.line}`, width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8, width: '100%', minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: '1 1 auto' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColor(s), flexShrink: 0 }} />
                  <Typography fontSize={{ xs: 13, sm: 14 }} fontWeight={600} noWrap>{s}</Typography>
                </Stack>
                <Typography fontSize={{ xs: 12.5, sm: 13.5 }} fontWeight={700} color={brand.green} sx={{ flexShrink: 0, ml: 1, whiteSpace: 'nowrap' }}>
                  {n} <Typography component="span" fontSize={11} color="text.secondary">({pct}%)</Typography>
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 7,
                  borderRadius: 4,
                  bgcolor: '#EAE4D5',
                  '& .MuiLinearProgress-bar': { bgcolor: statusColor(s), borderRadius: 4 },
                }}
              />
            </Box>
          );
        })}
      </Stack>
      <Typography sx={{ mt: 2.5, mb: 1.2, fontWeight: 700, fontSize: { xs: 13.5, sm: 14.5 }, color: brand.green }}>Quick shop</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1, width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
        {CATEGORIES.map((c) => (
          <Button
            key={c.key}
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => navigate(`/buyer/browse?cat=${c.key}`)}
            sx={{
              borderRadius: 999,
              py: 0.8,
              px: { xs: 1, sm: 2 },
              fontSize: { xs: 11.5, sm: 13 },
              fontWeight: 600,
              bgcolor: '#fff',
              borderColor: brand.line,
              color: brand.text,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
              '&:hover': { bgcolor: brand.cream, borderColor: brand.green },
            }}
          >
            {c.label}
          </Button>
        ))}
      </Box>
    </Panel>
  );
};

export default OrderStatusSummary;
