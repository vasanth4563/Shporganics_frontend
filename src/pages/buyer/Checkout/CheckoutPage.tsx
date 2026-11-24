import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Lock, ShoppingBag } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressSelector from '../../../components/cart/AddressSelector';
import PaymentSelector, { type CardDetails, type UpiApp, detectCardBrand } from '../../../components/cart/PaymentSelector';
import { SummaryCard } from '../../../components/cart/CartComponents';
import { EmptyState, SmartImage } from '../../../components/common';
import { brand } from '../../../theme/theme';
import { formatPrice } from '../../../utils/format';
import { useAuth, useCart, useOrders, useProducts, useToast } from '../../../hooks';
import type { PaymentMode } from '../../../types';

const CheckoutPage = () => {
  const { user, updateProfile } = useAuth();
  const { lines, subtotal, delivery, total, clear } = useCart();
  const { placeOrder } = useOrders();
  const { reduceStock } = useProducts();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [f, setF] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    address: user?.address?.address?.includes('Flat 402, Green Meadows') ? '' : (user?.address?.address ?? ''),
    city: user?.address?.address?.includes('Flat 402, Green Meadows') ? '' : (user?.address?.city ?? ''),
    state: user?.address?.address?.includes('Flat 402, Green Meadows') ? '' : (user?.address?.state ?? 'Tamil Nadu'),
    pincode: user?.address?.address?.includes('Flat 402, Green Meadows') ? '' : (user?.address?.pincode ?? ''),
  });

  const [pay, setPay] = useState<PaymentMode>('Cash on Delivery');
  const [upiApp, setUpiApp] = useState<UpiApp>('gpay');
  const [upi, setUpi] = useState('user@okhdfcbank');
  const [card, setCard] = useState<CardDetails>({
    number: '',
    name: user?.name ? user.name.toUpperCase() : 'ANANYA SHARMA',
    expiry: '',
    cvv: '',
  });
  const [cardErr, setCardErr] = useState<Record<string, string>>({});
  const [err, setErr] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  if (!lines.length)
    return (
      <Box sx={{ bgcolor: '#fff', borderRadius: 5, border: `1px solid ${brand.line}` }}>
        <EmptyState icon={ShoppingBag} title="Nothing to checkout" message="Add some products to your cart first." action={<Button variant="contained" onClick={() => navigate('/buyer/browse')}>Browse products</Button>} />
      </Box>
    );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    (['name', 'address', 'city', 'state'] as const).forEach((k) => { if (!f[k].trim()) er[k] = 'Required'; });
    if (!/^[6-9]\d{9}$/.test(f.phone)) er.phone = 'Enter a valid 10-digit number';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email';
    if (!/^\d{6}$/.test(f.pincode)) er.pincode = 'Enter a 6-digit pincode';
    if (pay === 'UPI' && (!upi.trim() || !/^[\w.-]+@[\w]+$/.test(upi.trim()))) {
      er.upi = 'Enter a valid UPI ID (e.g. 9876543210@paytm or name@okaxis)';
    }
    if (pay === 'Card / Net Banking') {
      const cleanNum = card.number.replace(/\s/g, '');
      if (cleanNum.length < 16) er.cardNumber = '16-digit card number required';
      if (!card.name.trim()) er.cardName = 'Cardholder name required';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) er.cardExpiry = 'MM/YY required';
      if (card.cvv.length < 3) er.cardCvv = '3-digit CVV required';
    }
    setErr(er);
    setCardErr({
      number: er.cardNumber,
      name: er.cardName,
      expiry: er.cardExpiry,
      cvv: er.cardCvv,
    });
    if (Object.keys(er).length) return notify('Please fix the highlighted fields', 'error');

    const appName = upiApp === 'gpay' ? 'Google Pay' : upiApp === 'phonepe' ? 'PhonePe' : upiApp === 'paytm' ? 'Paytm' : 'UPI';
    const finalPaymentMode =
      pay === 'UPI'
        ? `UPI (${appName}: ${upi})`
        : pay === 'Card / Net Banking'
        ? `Card (${detectCardBrand(card.number)} ···· ${card.number.slice(-4) || '8888'})`
        : 'Cash on Delivery';

    setPlacing(true);
    setTimeout(() => {
      const order = placeOrder({
        buyerId: user?.id || 'u-buyer', buyerName: f.name, email: f.email, phone: f.phone,
        shipping: { address: f.address, city: f.city, state: f.state, pincode: f.pincode },
        items: lines.map((l) => ({ productId: l.productId, name: l.product.name, image: l.product.image, price: l.product.discountPrice, quantity: l.quantity })),
        subtotal, delivery, total, paymentMode: finalPaymentMode,
      });
      if (user && updateProfile) {
        updateProfile({
          phone: f.phone,
          address: { address: f.address, city: f.city, state: f.state, pincode: f.pincode },
        });
      }
      reduceStock(lines.map((l) => ({ productId: l.productId, quantity: l.quantity })));
      clear();
      setPlacing(false);
      notify(`Order ${order.id} placed successfully!`);
      navigate(`/buyer/track?id=${order.id}`, { state: { justPlaced: true } });
    }, 900);
  };

  return (
    <Box component="form" onSubmit={submit} noValidate sx={{ width: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' }, gap: { xs: 2.5, md: 4 }, width: '100%' }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ p: { xs: 2.5, sm: 4 }, bgcolor: '#fff', borderRadius: 5, border: `1px solid ${brand.line}` }}>
            <Typography variant="h5" sx={{ color: brand.green, mb: 2.5 }}>1. Delivery details</Typography>
            <Stack spacing={2.2}>
              <TextField
                id="checkout-email"
                fullWidth
                size="small"
                label="Email address (for order updates)"
                placeholder="your.email@example.com"
                value={f.email}
                onChange={(e) => {
                  setF({ ...f, email: e.target.value });
                  setErr((prev) => {
                    const next = { ...prev };
                    delete next.email;
                    return next;
                  });
                }}
                error={!!err.email}
                helperText={err.email}
              />
              <AddressSelector
                value={f}
                onChange={(val) => setF((prev) => ({ ...prev, ...val }))}
                errors={err}
                onClearError={(field) =>
                  setErr((prev) => {
                    const next = { ...prev };
                    delete next[field];
                    return next;
                  })
                }
              />
            </Stack>
          </Box>
          <Box sx={{ p: { xs: 2.5, sm: 4 }, bgcolor: '#fff', borderRadius: 5, border: `1px solid ${brand.line}`, mt: 3 }}>
            <Typography variant="h5" sx={{ color: brand.green, mb: 3 }}>2. Payment method</Typography>
            <PaymentSelector
              mode={pay}
              onModeChange={setPay}
              upiApp={upiApp}
              onUpiAppChange={setUpiApp}
              upiId={upi}
              onUpiIdChange={(v) => {
                setUpi(v);
                setErr((prev) => ({ ...prev, upi: '' }));
              }}
              upiErr={err.upi}
              card={card}
              onCardChange={(c) => {
                setCard(c);
                setCardErr({});
              }}
              cardErr={cardErr}
            />
          </Box>
        </Box>
        <Box sx={{ width: '100%' }}>
          <SummaryCard subtotal={subtotal} delivery={delivery} total={total} extra={
            <Stack spacing={1.8} sx={{ mb: 2.5, maxHeight: 280, overflowY: 'auto', pr: .5 }}>
              {lines.map((l) => (
                <Stack key={l.productId} direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ position: 'relative' }}>
                    <SmartImage src={l.product.image} alt={l.product.name} sx={{ width: 56, height: 56, borderRadius: 2.5 }} />
                    <Box sx={{ position: 'absolute', top: -6, right: -6, minWidth: 22, height: 22, borderRadius: 999, bgcolor: brand.green, color: '#fff', fontSize: 12, fontWeight: 700, display: 'grid', placeItems: 'center' }}>{l.quantity}</Box>
                  </Box>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography fontWeight={600} fontSize={14} noWrap>{l.product.name}</Typography>
                    <Typography fontSize={12.5} color="text.secondary">Qty {l.quantity} × {formatPrice(l.product.discountPrice)}</Typography>
                  </Box>
                  <Typography fontWeight={600} fontSize={14}>{formatPrice(l.lineTotal)}</Typography>
                </Stack>
              ))}
            </Stack>
          }>
            <Button id="place-order" type="submit" fullWidth size="large" variant="contained" disabled={placing} startIcon={<Lock size={16} />} sx={{ py: 1.5 }}>
              {placing ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
            </Button>
            <Typography fontSize={12} color="text.secondary" textAlign="center" sx={{ mt: 1.5 }}>Demo checkout — no real payment will be charged.</Typography>
          </SummaryCard>
        </Box>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
