import {
  Box,
  Chip,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import type { ChangeEvent } from 'react';
import { brand } from '../../theme/theme';
import type { PaymentMode } from '../../types';

export type UpiApp = 'gpay' | 'phonepe' | 'paytm' | 'other';

export interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

export interface PaymentSelectorProps {
  mode?: PaymentMode;
  pay?: PaymentMode;
  onModeChange?: (m: PaymentMode) => void;
  setPay?: (m: PaymentMode) => void;
  upiApp: UpiApp;
  onUpiAppChange?: (app: UpiApp) => void;
  setUpiApp?: (app: UpiApp) => void;
  upiId: string;
  onUpiIdChange?: (v: string) => void;
  setUpiId?: (v: string) => void;
  upiErr?: string;
  card: CardDetails;
  onCardChange?: (c: CardDetails) => void;
  setCard?: (c: CardDetails) => void;
  cardErr?: { number?: string; name?: string; expiry?: string; cvv?: string } | Record<string, string>;
  total?: number;
  hideCard?: boolean;
}

const UPI_APPS: { id: UpiApp; label: string; sub: string; color: string; bg: string; defaultHandle: string }[] = [
  { id: 'gpay', label: 'Google Pay', sub: 'Instant via UPI', color: '#1A73E8', bg: '#E8F0FE', defaultHandle: '@okhdfcbank' },
  { id: 'phonepe', label: 'PhonePe', sub: 'Instant via UPI', color: '#5F259F', bg: '#F3E8FD', defaultHandle: '@ybl' },
  { id: 'paytm', label: 'Paytm UPI', sub: 'Instant via UPI', color: '#00BAF2', bg: '#E6F8FE', defaultHandle: '@paytm' },
  { id: 'other', label: 'Other UPI', sub: 'Any UPI ID', color: brand.green, bg: brand.cream, defaultHandle: '@upi' },
];

export function detectCardBrand(num: string): string {
  const clean = num.replace(/\D/g, '');
  if (clean.startsWith('4')) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'Mastercard';
  if (/^(60|65|81|82|508)/.test(clean)) return 'RuPay';
  if (/^3[47]/.test(clean)) return 'Amex';
  return 'Card';
}

export function formatCardNumber(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatExpiry(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }
  return digits;
}

export default function PaymentSelector({
  mode,
  pay,
  onModeChange,
  setPay,
  upiApp,
  onUpiAppChange,
  setUpiApp,
  upiId,
  onUpiIdChange,
  setUpiId,
  upiErr,
  card,
  onCardChange,
  setCard,
  cardErr = {},
  hideCard = false,
}: PaymentSelectorProps) {
  const rawMode = (pay ?? mode ?? 'Cash on Delivery') as PaymentMode;
  const currentMode = hideCard && rawMode === 'Card / Net Banking' ? 'Cash on Delivery' : rawMode;
  const notifyMode = (m: PaymentMode) => {
    if (setPay) setPay(m);
    if (onModeChange) onModeChange(m);
  };
  const notifyUpiApp = (app: UpiApp) => {
    if (setUpiApp) setUpiApp(app);
    if (onUpiAppChange) onUpiAppChange(app);
  };
  const notifyUpiId = (id: string) => {
    if (setUpiId) setUpiId(id);
    if (onUpiIdChange) onUpiIdChange(id);
  };
  const notifyCard = (c: CardDetails) => {
    if (setCard) setCard(c);
    if (onCardChange) onCardChange(c);
  };

  const cardBrand = detectCardBrand(card.number);

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    notifyCard({ ...card, number: formatted });
  };

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    notifyCard({ ...card, expiry: formatted });
  };

  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 3);
    notifyCard({ ...card, cvv: clean });
  };

  const handleAppSelect = (app: UpiApp) => {
    notifyUpiApp(app);
    const chosen = UPI_APPS.find((a) => a.id === app);
    if (chosen && !upiId.includes('@')) {
      notifyUpiId(upiId ? `${upiId}${chosen.defaultHandle}` : `user${chosen.defaultHandle}`);
    } else if (chosen && upiId.includes('@')) {
      const username = upiId.split('@')[0];
      notifyUpiId(`${username}${chosen.defaultHandle}`);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <RadioGroup value={currentMode} onChange={(e) => notifyMode(e.target.value as PaymentMode)}>
        <Stack spacing={2}>
          {/* ==================== 1. CASH ON DELIVERY ==================== */}
          <Box
            sx={{
              p: 2,
              borderRadius: '18px',
              border: `1.5px solid ${currentMode === 'Cash on Delivery' ? brand.green : brand.line}`,
              bgcolor: currentMode === 'Cash on Delivery' ? '#F4F8F2' : '#fff',
              transition: 'all 0.25s ease',
              cursor: 'pointer',
            }}
            onClick={() => notifyMode('Cash on Delivery')}
          >
            <FormControlLabel
              value="Cash on Delivery"
              control={<Radio size="small" />}
              sx={{ width: '100%', m: 0 }}
              label={
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '12px',
                      bgcolor: brand.cream,
                      color: brand.green,
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Banknote size={20} />
                  </Box>
                  <Box>
                    <Typography fontSize={14} fontWeight={700} color={brand.text}>
                      Cash on Delivery (COD)
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      Pay with cash or UPI on delivery
                    </Typography>
                  </Box>
                </Stack>
              }
            />
            {currentMode === 'Cash on Delivery' && (
              <Box sx={{ mt: 1.5, pt: 1.2, borderTop: `1px dashed ${brand.line}`, pl: { xs: 1, sm: 5.5 } }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircle2 size={15} color={brand.leaf} />
                  <Typography fontSize={12.5} color={brand.leaf} fontWeight={600}>
                    No advance payment required. Keep exact change or scan delivery QR.
                  </Typography>
                </Stack>
              </Box>
            )}
          </Box>

          {/* ==================== 2. UPI (GPAY, PHONEPE, PAYTM) ==================== */}
          <Box
            sx={{
              p: 2,
              borderRadius: '18px',
              border: `1.5px solid ${currentMode === 'UPI' ? brand.green : brand.line}`,
              bgcolor: currentMode === 'UPI' ? '#F4F8F2' : '#fff',
              transition: 'all 0.25s ease',
            }}
          >
            <FormControlLabel
              value="UPI"
              control={<Radio size="small" />}
              sx={{ width: '100%', m: 0 }}
              label={
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '12px',
                      bgcolor: '#E8F0FE',
                      color: '#1A73E8',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Smartphone size={20} />
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontSize={14} fontWeight={700} color={brand.text}>
                        UPI Payments
                      </Typography>
                      <Chip label="Instant" size="small" sx={{ height: 18, fontSize: 10, bgcolor: '#E8F0FE', color: '#1A73E8', fontWeight: 700 }} />
                    </Stack>
                    <Typography fontSize={12} color="text.secondary">
                      Google Pay, PhonePe, Paytm & any UPI ID
                    </Typography>
                  </Box>
                </Stack>
              }
            />

            {currentMode === 'UPI' && (
              <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px dashed ${brand.line}` }}>
                <Typography fontSize={12} fontWeight={700} color={brand.muted} sx={{ mb: 1.2, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  Choose your UPI App:
                </Typography>

                {/* 4 UPI App Choice Cards */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                    gap: 1.2,
                    mb: 2,
                  }}
                >
                  {UPI_APPS.map((app) => {
                    const active = upiApp === app.id;
                    return (
                      <Box
                        key={app.id}
                        onClick={() => handleAppSelect(app.id)}
                        sx={{
                          p: 1.2,
                          borderRadius: '14px',
                          border: `1.5px solid ${active ? app.color : brand.line}`,
                          bgcolor: active ? app.bg : '#fff',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s ease',
                          boxShadow: active ? `0 4px 12px ${app.color}25` : 'none',
                          '&:hover': { transform: 'translateY(-2px)' },
                        }}
                      >
                        <Typography fontSize={13} fontWeight={700} color={active ? app.color : brand.text}>
                          {app.label}
                        </Typography>
                        <Typography fontSize={10.5} color="text.secondary">
                          {app.sub}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                {/* UPI ID Input */}
                <Box sx={{ bgcolor: '#fff', p: 1.8, borderRadius: '14px', border: `1px solid ${brand.line}` }}>
                  <Typography fontSize={12.5} fontWeight={600} color={brand.text} sx={{ mb: 0.8 }}>
                    Enter UPI ID ({UPI_APPS.find((a) => a.id === upiApp)?.label}):
                  </Typography>
                  <TextField
                    id="upi-id-input"
                    fullWidth
                    size="small"
                    placeholder={`e.g. mobile${UPI_APPS.find((a) => a.id === upiApp)?.defaultHandle || '@upi'}`}
                    value={upiId}
                    onChange={(e) => notifyUpiId(e.target.value)}
                    error={!!upiErr}
                    helperText={upiErr || `Payment request will be routed via ${UPI_APPS.find((a) => a.id === upiApp)?.label}.`}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Smartphone size={16} color={brand.leaf} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Chip label="Verified" size="small" sx={{ height: 20, fontSize: 10, bgcolor: '#E8F8ED', color: brand.leaf, fontWeight: 700 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* Quick autofill pills */}
                  <Stack direction="row" spacing={0.8} sx={{ mt: 1.2 }} flexWrap="wrap">
                    <Typography fontSize={11} color="text.secondary" sx={{ alignSelf: 'center' }}>
                      Sample IDs:
                    </Typography>
                    {['9876543210@paytm', 'ananya@okhdfcbank', 'organics@ybl'].map((h) => (
                      <Chip
                        key={h}
                        label={h}
                        size="small"
                        onClick={() => notifyUpiId(h)}
                        clickable
                        sx={{ fontSize: 11, height: 22, bgcolor: brand.cream, color: brand.green }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            )}
          </Box>

          {/* ==================== 3. CARD / NET BANKING ==================== */}
          {!hideCard && (
            <Box
              sx={{
                p: 2,
              borderRadius: '18px',
              border: `1.5px solid ${currentMode === 'Card / Net Banking' ? brand.green : brand.line}`,
              bgcolor: currentMode === 'Card / Net Banking' ? '#F4F8F2' : '#fff',
              transition: 'all 0.25s ease',
            }}
          >
            <FormControlLabel
              value="Card / Net Banking"
              control={<Radio size="small" />}
              sx={{ width: '100%', m: 0 }}
              label={
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '12px',
                      bgcolor: '#F3E8FD',
                      color: '#8B5CF6',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <CreditCard size={20} />
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontSize={14} fontWeight={700} color={brand.text}>
                        Credit / Debit Card
                      </Typography>
                      <Chip label={cardBrand} size="small" sx={{ height: 18, fontSize: 10, bgcolor: brand.cream, color: brand.green, fontWeight: 700 }} />
                    </Stack>
                    <Typography fontSize={12} color="text.secondary">
                      Visa, Mastercard, RuPay & all major banks
                    </Typography>
                  </Box>
                </Stack>
              }
            />

            {currentMode === 'Card / Net Banking' && (
              <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px dashed ${brand.line}` }}>
                {/* Visual Card Form */}
                <Box
                  sx={{
                    p: { xs: 1.8, sm: 2.2 },
                    borderRadius: '16px',
                    bgcolor: '#fff',
                    border: `1px solid ${brand.line}`,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography fontSize={12.5} fontWeight={700} color={brand.green}>
                      Enter Card Details
                    </Typography>
                    <Stack direction="row" spacing={0.6} alignItems="center">
                      <ShieldCheck size={14} color={brand.leaf} />
                      <Typography fontSize={11} color={brand.leaf} fontWeight={600}>
                        100% Encrypted & Safe
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack spacing={1.5}>
                    {/* Card Number */}
                    <TextField
                      id="card-number-input"
                      fullWidth
                      size="small"
                      label="Card Number"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={card.number}
                      onChange={handleCardNumberChange}
                      error={!!cardErr.number}
                      helperText={cardErr.number}
                      inputProps={{ maxLength: 19 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCard size={18} color={brand.leaf} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Chip label={cardBrand} size="small" sx={{ height: 20, fontSize: 10, bgcolor: brand.cream, color: brand.green, fontWeight: 700 }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* Cardholder Name */}
                    <TextField
                      id="card-name-input"
                      fullWidth
                      size="small"
                      label="Cardholder Name"
                      placeholder="Name as printed on card"
                      value={card.name}
                      onChange={(e) => notifyCard({ ...card, name: e.target.value.toUpperCase() })}
                      error={!!cardErr.name}
                      helperText={cardErr.name}
                    />

                    {/* Expiry & CVV */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                      <TextField
                        id="card-expiry-input"
                        fullWidth
                        size="small"
                        label="Valid Thru"
                        placeholder="MM/YY"
                        value={card.expiry}
                        onChange={handleExpiryChange}
                        error={!!cardErr.expiry}
                        helperText={cardErr.expiry}
                        inputProps={{ maxLength: 5 }}
                      />
                      <TextField
                        id="card-cvv-input"
                        fullWidth
                        size="small"
                        label="CVV"
                        placeholder="3 digits"
                        type="password"
                        value={card.cvv}
                        onChange={handleCvvChange}
                        error={!!cardErr.cvv}
                        helperText={cardErr.cvv}
                        inputProps={{ maxLength: 3 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Lock size={15} color={brand.muted} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    {/* Test Cards Quick Fill */}
                    <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap" sx={{ pt: 0.5 }}>
                      <Typography fontSize={11} color="text.secondary">
                        Demo card autofill:
                      </Typography>
                      <Chip
                        label="Visa Demo"
                        size="small"
                        clickable
                        onClick={() =>
                          notifyCard({
                            number: '4532 8901 2345 6789',
                            name: 'ANANYA SHARMA',
                            expiry: '12/28',
                            cvv: '888',
                          })
                        }
                        sx={{ fontSize: 11, height: 22, bgcolor: brand.cream, color: brand.green }}
                      />
                      <Chip
                        label="RuPay Demo"
                        size="small"
                        clickable
                        onClick={() =>
                          notifyCard({
                            number: '6071 5200 4433 1122',
                            name: 'SHP CUSTOMER',
                            expiry: '09/27',
                            cvv: '123',
                          })
                        }
                        sx={{ fontSize: 11, height: 22, bgcolor: brand.cream, color: brand.green }}
                      />
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            )}
          </Box>
          )}
        </Stack>
      </RadioGroup>
    </Box>
  );
}
