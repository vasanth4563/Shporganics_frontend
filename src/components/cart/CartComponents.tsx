import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import type { CartLine } from '../../context/CartContext';
import { brand } from '../../theme/theme';
import { formatPrice } from '../../utils/format';
import { QuantitySelector, SmartImage } from '../common';

export function CartItemRow({ line, onQty, onRemove }: { line: CartLine; onQty: (q: number) => void; onRemove: () => void }) {
  const { product } = line;
  return (
    <Stack direction="row" spacing={2.5} alignItems="center" sx={{ py: 2.5 }}>
      <SmartImage src={product.image} alt={product.name} sx={{ width: { xs: 76, sm: 96 }, height: { xs: 76, sm: 96 }, borderRadius: 3, flexShrink: 0 }} />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: 18, fontWeight: 600 }} noWrap>{product.name}</Typography>
        <Typography fontSize={13} color="text.secondary">{product.weight} · Unit price {formatPrice(product.discountPrice)}</Typography>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1.2 }}>
          <QuantitySelector value={line.quantity} onChange={onQty} max={product.stock} size="sm" />
          <Typography sx={{ display: { xs: 'block', sm: 'none' }, fontWeight: 700 }}>{formatPrice(line.lineTotal)}</Typography>
        </Stack>
      </Box>
      <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 700, fontSize: 17, minWidth: 90, textAlign: 'right' }}>{formatPrice(line.lineTotal)}</Typography>
      <IconButton aria-label={`remove ${product.name}`} onClick={onRemove} sx={{ color: brand.muted, '&:hover': { color: '#C4462B', bgcolor: '#FDEDE8' } }}>
        <Trash2 size={18} />
      </IconButton>
    </Stack>
  );
}

export function SummaryCard({ subtotal, delivery, total, children, title = 'Order Summary', extra }: {
  subtotal: number; delivery: number; total: number; children?: ReactNode; title?: string; extra?: ReactNode;
}) {
  return (
    <Box sx={{ p: 3, borderRadius: 5, bgcolor: '#fff', border: `1px solid ${brand.line}`, position: { md: 'sticky' }, top: { md: 120 } }}>
      <Typography variant="h5" sx={{ color: brand.green, mb: 2.5 }}>{title}</Typography>
      {extra}
      <Stack spacing={1.3} sx={{ fontSize: 15 }}>
        <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">Subtotal</Typography><Typography fontWeight={600}>{formatPrice(subtotal)}</Typography></Stack>
        <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">Delivery charges</Typography>
          <Typography fontWeight={600} color={delivery ? 'text.primary' : brand.leaf}>{delivery ? formatPrice(delivery) : 'FREE'}</Typography></Stack>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 2.5 }}>
        <Typography fontWeight={600}>Grand total</Typography>
        <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: 28, fontWeight: 600, color: brand.green }}>{formatPrice(total)}</Typography>
      </Stack>
      {children}
    </Box>
  );
}
