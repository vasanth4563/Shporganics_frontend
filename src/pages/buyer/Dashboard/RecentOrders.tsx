import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Panel from '../../../components/common/Panel';
import { EmptyState, SmartImage, StatusChip } from '../../../components/common';
import { brand } from '../../../theme/theme';
import { formatDate, formatPrice } from '../../../utils/format';
import type { Order } from '../../../types';

interface RecentOrdersProps {
  orders: Order[];
  onSelect: (order: Order) => void;
}

const RecentOrders = ({ orders, onSelect }: RecentOrdersProps) => {
  const navigate = useNavigate();

  return (
    <Panel title="Recent orders" action={<Button size="small" onClick={() => navigate('/buyer/orders')} sx={{ fontSize: 13, fontWeight: 600, color: brand.green, px: 1.5, py: 0.5, minWidth: 0 }}>View all</Button>}>
      {orders.length ? (
        <Stack spacing={1.5} sx={{ width: '100%', minWidth: 0 }}>
          {orders.slice(0, 4).map((o) => (
            <Box
              key={o.id}
              onClick={() => onSelect(o)}
              sx={{
                p: { xs: 1.25, sm: 1.8 },
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all .2s ease',
                bgcolor: '#FAF7F0',
                border: `1px solid ${brand.line}`,
                width: '100%',
                minWidth: 0,
                maxWidth: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden',
                '&:hover': { bgcolor: '#F4EFE6', transform: 'translateY(-2px)' },
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ width: '100%', minWidth: 0 }}>
                <SmartImage
                  src={o.items[0]?.image}
                  alt={o.items[0]?.name}
                  sx={{ width: { xs: 44, sm: 52 }, height: { xs: 44, sm: 52 }, borderRadius: '12px', flexShrink: 0 }}
                />
                <Box sx={{ flex: '1 1 0%', minWidth: 0, overflow: 'hidden' }}>
                  <Typography
                    fontWeight={600}
                    fontSize={{ xs: 13, sm: 14.5 }}
                    noWrap
                    sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}
                  >
                    {o.items.map((i) => i.name).join(', ')}
                  </Typography>
                  <Typography fontSize={{ xs: 11, sm: 12.5 }} color="text.secondary" noWrap sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                    {o.id} · {formatDate(o.createdAt)}
                  </Typography>
                </Box>
                <Stack alignItems="flex-end" spacing={0.3} sx={{ flexShrink: 0, ml: 'auto', textAlign: 'right' }}>
                  <Typography fontWeight={700} fontSize={{ xs: 13, sm: 15 }} color={brand.green} sx={{ whiteSpace: 'nowrap' }}>
                    {formatPrice(o.total)}
                  </Typography>
                  <StatusChip status={o.status} />
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : <EmptyState title="No orders yet" message="Your orders will appear here." />}
    </Panel>
  );
};

export default RecentOrders;
