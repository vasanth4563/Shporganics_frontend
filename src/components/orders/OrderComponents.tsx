import { Box, Button, Dialog, DialogContent, Divider, IconButton, Stack, Typography } from '@mui/material';
import { Check, ClipboardCheck, Home, Package, Truck, X } from 'lucide-react';
import type { Order } from '../../types';
import { brand } from '../../theme/theme';
import { formatDate, formatPrice, ORDER_STAGES } from '../../utils/format';
import { SmartImage, StatusChip } from '../common';

const ICONS = [ClipboardCheck, Package, Truck, Home];

export function OrderTracker({ order, compact = false }: { order: Order; compact?: boolean }) {
  const idx = ORDER_STAGES.indexOf(order.status);
  return (
    <Box sx={{ position: 'relative', py: { xs: 1, sm: 1.5 }, width: '100%', overflow: 'hidden' }}>
      <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative', width: '100%' }}>
        {/* Progress track line */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 18, sm: compact ? 18 : 24 },
            left: '12.5%',
            right: '12.5%',
            height: 3,
            bgcolor: brand.line,
            borderRadius: 2,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 18, sm: compact ? 18 : 24 },
            left: '12.5%',
            height: 3,
            borderRadius: 2,
            bgcolor: brand.leaf,
            width: `${(idx / 3) * 75}%`,
            transition: 'width .8s cubic-bezier(.2,.7,.3,1)',
          }}
        />

        {ORDER_STAGES.map((s, i) => {
          const done = i <= idx;
          const Icon = done && i < idx ? Check : ICONS[i];
          const date = order.history.find((h) => h.status === s)?.date;

          return (
            <Stack key={s} alignItems="center" sx={{ flex: 1, zIndex: 1, textAlign: 'center', px: 0.5 }}>
              <Box
                sx={{
                  width: { xs: 36, sm: compact ? 36 : 48 },
                  height: { xs: 36, sm: compact ? 36 : 48 },
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  transition: 'all .4s',
                  bgcolor: done ? (i === idx ? brand.green : brand.leaf) : '#fff',
                  color: done ? '#fff' : brand.muted,
                  border: `2px solid ${done ? 'transparent' : brand.line}`,
                  boxShadow: i === idx ? `0 0 0 5px ${brand.leaf}22` : 'none',
                }}
              >
                <Icon size={16} />
              </Box>
              <Typography
                sx={{
                  mt: 0.8,
                  fontSize: { xs: 11, sm: compact ? 12 : 13.5 },
                  fontWeight: done ? 700 : 500,
                  color: done ? brand.text : 'text.secondary',
                  whiteSpace: 'nowrap',
                }}
              >
                {s}
              </Typography>
              {!compact && (
                <Typography sx={{ fontSize: { xs: 10, sm: 11.5 }, color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                  {date ? formatDate(date) : 'Pending'}
                </Typography>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}

export function OrderDetailsDialog({
  order,
  onClose,
  onTrack,
}: {
  order: Order | null;
  onClose: () => void;
  onTrack?: (o: Order) => void;
}) {
  return (
    <Dialog open={!!order} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { m: { xs: 1.5, sm: 3 } } }}>
      {order && (
        <DialogContent sx={{ p: { xs: 2, sm: 3.5 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="overline" color="text.secondary">Order details</Typography>
              <Typography variant="h5" sx={{ color: brand.green, fontSize: { xs: 18, sm: 22 } }}>{order.id}</Typography>
              <Typography fontSize={12.5} color="text.secondary">Placed on {formatDate(order.createdAt)} · {order.paymentMode}</Typography>
            </Box>
            <IconButton onClick={onClose} aria-label="close"><X size={20} /></IconButton>
          </Stack>

          <Box sx={{ my: 2.5 }}><OrderTracker order={order} compact /></Box>

          <Stack spacing={1.5} sx={{ maxHeight: 220, overflowY: 'auto' }}>
            {order.items.map((i) => (
              <Stack key={i.productId} direction="row" spacing={1.5} alignItems="center">
                <SmartImage src={i.image} alt={i.name} sx={{ width: 44, height: 44, borderRadius: 2 }} />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography fontWeight={600} fontSize={13.5} noWrap>{i.name}</Typography>
                  <Typography fontSize={12} color="text.secondary">{formatPrice(i.price)} × {i.quantity}</Typography>
                </Box>
                <Typography fontWeight={600} fontSize={13.5}>{formatPrice(i.price * i.quantity)}</Typography>
              </Stack>
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={0.8} sx={{ fontSize: 13.5 }}>
            <Stack direction="row" justifyContent="space-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></Stack>
            <Stack direction="row" justifyContent="space-between"><span>Delivery</span><span>{order.delivery ? formatPrice(order.delivery) : 'Free'}</span></Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ fontWeight: 700, fontSize: 16, pt: 0.5 }}><span>Total</span><span>{formatPrice(order.total)}</span></Stack>
          </Stack>

          <Box sx={{ mt: 2.5, p: 2, borderRadius: 3, bgcolor: brand.cream }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography fontWeight={600} fontSize={13.5}>Delivering to {order.buyerName}</Typography>
              <StatusChip status={order.status} />
            </Stack>
            <Typography fontSize={12.5} color="text.secondary">
              {order.shipping.address}, {order.shipping.city}, {order.shipping.state} – {order.shipping.pincode} · {order.phone}
            </Typography>
          </Box>

          {onTrack && (
            <Button fullWidth variant="contained" sx={{ mt: 2.5 }} onClick={() => onTrack(order)}>
              Track this order
            </Button>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
