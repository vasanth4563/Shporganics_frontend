import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Typography, type ButtonProps } from '@mui/material';
import { Minus, Plus, PackageOpen, type LucideIcon, AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { brand } from '../../theme/theme';
import { statusColor } from '../../utils/format';
import type { OrderStatus } from '../../types';

/* ---------- SectionTitle ---------- */
export function SectionTitle({ eyebrow, title, subtitle, align = 'center', action }: {
  eyebrow?: string; title: string; subtitle?: string; align?: 'center' | 'left'; action?: ReactNode;
}) {
  return (
    <Stack direction={{ xs: 'column', md: align === 'left' ? 'row' : 'column' }} alignItems={align === 'center' ? 'center' : { xs: 'flex-start', md: 'flex-end' }}
      justifyContent="space-between" spacing={2} sx={{ mb: { xs: 4, md: 6 }, textAlign: align }}>
      <Box sx={{ maxWidth: 640 }}>
        {eyebrow && <Typography variant="overline" sx={{ color: brand.leaf, fontSize: 12 }}>{eyebrow}</Typography>}
        <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 }, color: brand.green, mt: 0.5 }}>{title}</Typography>
        {subtitle && <Typography sx={{ color: 'text.secondary', mt: 1.5, fontSize: 16.5, lineHeight: 1.7 }}>{subtitle}</Typography>}
      </Box>
      {action}
    </Stack>
  );
}

/* ---------- QuantitySelector ---------- */
export function QuantitySelector({ value, onChange, max = 99, min = 1, size = 'md' }: {
  value: number; onChange: (v: number) => void; max?: number; min?: number; size?: 'sm' | 'md';
}) {
  const h = size === 'sm' ? 34 : 40;
  return (
    <Stack direction="row" alignItems="center" sx={{ border: `1px solid ${brand.line}`, borderRadius: 999, height: h, bgcolor: '#fff', width: 'fit-content' }}>
      <IconButton size="small" aria-label="decrease quantity" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} sx={{ mx: 0.3 }}>
        <Minus size={15} />
      </IconButton>
      <Typography sx={{ minWidth: 26, textAlign: 'center', fontWeight: 600, fontSize: 14 }}>{value}</Typography>
      <IconButton size="small" aria-label="increase quantity" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} sx={{ mx: 0.3 }}>
        <Plus size={15} />
      </IconButton>
    </Stack>
  );
}

/* ---------- EmptyState ---------- */
export function EmptyState({ icon: Icon = PackageOpen, title, message, action }: {
  icon?: LucideIcon; title: string; message?: string; action?: ReactNode;
}) {
  return (
    <Stack alignItems="center" textAlign="center" spacing={1.5} sx={{ py: 8, px: 2 }}>
      <Box sx={{ width: 84, height: 84, borderRadius: '50%', bgcolor: brand.cream, display: 'grid', placeItems: 'center', color: brand.leaf, mb: 1 }}>
        <Icon size={36} strokeWidth={1.6} />
      </Box>
      <Typography variant="h5" sx={{ color: brand.green }}>{title}</Typography>
      {message && <Typography color="text.secondary" sx={{ maxWidth: 380 }}>{message}</Typography>}
      {action && <Box sx={{ pt: 1 }}>{action}</Box>}
    </Stack>
  );
}

/* ---------- StatCard ---------- */
export function StatCard({ label, value, icon: Icon, tint = brand.green, hint }: {
  label: string; value: ReactNode; icon: LucideIcon; tint?: string; hint?: string;
}) {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: '22px',
        bgcolor: '#FFFFFF',
        border: `1px solid ${brand.line}`,
        height: '100%',
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(25, 77, 53, 0.04)',
        transition: 'all 0.25s cubic-bezier(0.2, 0.7, 0.3, 1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 28px rgba(25, 77, 53, 0.09)',
        },
      }}
    >
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: tint + '18',
          color: tint,
          mb: 1.2,
        }}
      >
        <Icon size={22} strokeWidth={2.2} />
      </Box>
      <Typography
        sx={{
          fontFamily: '"Fraunces", serif',
          fontSize: { xs: 28, sm: 34 },
          fontWeight: 700,
          color: brand.text,
          lineHeight: 1.1,
          mb: 0.5,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: { xs: 13, sm: 13.5 },
          fontWeight: 500,
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
      {hint && (
        <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 0.5 }}>
          {hint}
        </Typography>
      )}
    </Box>
  );
}

/* ---------- StatusChip ---------- */
export function StatusChip({ status }: { status: OrderStatus }) {
  const c = statusColor(status);
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.4, borderRadius: 999,
      bgcolor: c + '1A', color: c, fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
      <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: c }} />
      {status}
    </Box>
  );
}

/* ---------- ConfirmDialog ---------- */
export function ConfirmDialog({ open, title, message, confirmText = 'Confirm', color = 'error', onConfirm, onClose }: {
  open: boolean; title: string; message: string; confirmText?: string; color?: ButtonProps['color']; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ pt: 4, textAlign: 'center' }}>
        <Box sx={{ width: 56, height: 56, mx: 'auto', mb: 2, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: '#FDEDE8', color: '#C4462B' }}>
          <AlertTriangle size={26} />
        </Box>
        <Typography variant="h5" sx={{ mb: 1 }}>{title}</Typography>
        <Typography color="text.secondary">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1, justifyContent: 'center' }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color={color} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
}

/* ---------- SmartImage (graceful fallback if asset missing) ---------- */
export function SmartImage({ src, alt, sx }: { src: string; alt: string; sx?: object }) {
  const [err, setErr] = useState(false);
  if (err)
    return (
      <Box sx={{ ...sx, display: 'grid', placeItems: 'center', background: `linear-gradient(135deg, ${brand.cream}, #EADFC8)`, color: brand.leaf }}>
        <PackageOpen size={34} strokeWidth={1.4} />
      </Box>
    );
  return <Box component="img" src={src} alt={alt} loading="lazy" onError={() => setErr(true)} sx={{ objectFit: 'cover', display: 'block', ...sx }} />;
}
