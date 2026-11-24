import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Lock,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AddressSelector from './AddressSelector';
import PaymentSelector, { type CardDetails, type UpiApp, detectCardBrand } from './PaymentSelector';
import { brand } from '../../theme/theme';
import { formatPrice } from '../../utils/format';
import { useAuth, useCart, useOrders, useProducts, useToast } from '../../hooks';
import type { PaymentMode } from '../../types';

const ACCENT_RED = '#EF4444';
const ACCENT_RED_HOVER = '#DC2626';
const VEG_GREEN = '#2EA043';

/** Indian FSSAI Green Vegetarian Emblem */
function VegIcon() {
  return (
    <Box
      sx={{
        width: 15,
        height: 15,
        border: `1.5px solid ${VEG_GREEN}`,
        borderRadius: '3px',
        display: 'grid',
        placeItems: 'center',
        p: '2px',
        flexShrink: 0,
      }}
      aria-label="Vegetarian product"
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: VEG_GREEN }} />
    </Box>
  );
}

export default function QuickCheckoutDialog() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/buyer');
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/' ||
    location.pathname === '';
  const isFullCheckout = location.pathname === '/checkout';
  const { user, updateProfile } = useAuth();
  const isSeller = user?.role === 'seller' || location.pathname.startsWith('/seller');
  const {
    lines,
    count,
    subtotal,
    delivery,
    total,
    setQty,
    remove,
    clear,
    quickCheckoutOpen,
    openQuickCheckout,
    closeQuickCheckout,
  } = useCart();
  const { placeOrder } = useOrders();
  const { reduceStock } = useProducts();
  const { notify } = useToast();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  // Address state
  const [addr, setAddr] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    state: user?.address?.state || 'Tamil Nadu',
    pincode: user?.address?.pincode || '',
  });
  const [addrErr, setAddrErr] = useState<Record<string, string>>({});

  // Payment state
  const [pay, setPay] = useState<PaymentMode>('Cash on Delivery');
  const [upiApp, setUpiApp] = useState<UpiApp>('gpay');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [upiErr, setUpiErr] = useState('');
  const [card, setCard] = useState<CardDetails>({
    number: '',
    name: user?.name ? user.name.toUpperCase() : 'ANANYA SHARMA',
    expiry: '',
    cvv: '',
  });
  const [cardErr, setCardErr] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  // Sync address with logged in user profile
  useEffect(() => {
    if (user) {
      const isLegacyDemoAddr = user.address?.address?.includes('Flat 402, Green Meadows');
      setAddr((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
        address: !isLegacyDemoAddr && user.address?.address ? user.address.address : prev.address,
        city: !isLegacyDemoAddr && user.address?.city ? user.address.city : prev.city,
        state: !isLegacyDemoAddr && user.address?.state ? user.address.state : (prev.state || 'Tamil Nadu'),
        pincode: !isLegacyDemoAddr && user.address?.pincode ? user.address.pincode : prev.pincode,
      }));
      if (user.name) {
        setCard((c) => ({ ...c, name: user.name.toUpperCase() }));
      }
    }
  }, [user]);

  // When dialog opens, reset to cart step
  useEffect(() => {
    if (quickCheckoutOpen) {
      setStep('cart');
    }
  }, [quickCheckoutOpen]);

  const validateAddress = () => {
    const err: Record<string, string> = {};
    if (!addr.name.trim()) err.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(addr.phone)) err.phone = '10-digit mobile number';
    if (!addr.address.trim()) err.address = 'Street address required';
    if (!addr.city.trim()) err.city = 'City required';
    if (!/^\d{6}$/.test(addr.pincode)) err.pincode = '6-digit pincode';
    setAddrErr(err);
    return Object.keys(err).length === 0;
  };

  const handlePlaceOrder = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!lines.length) return notify('Your cart is empty', 'warning');
    if (!validateAddress()) {
      return notify('Please fill all required delivery address fields', 'error');
    }
    if (pay === 'UPI') {
      if (!upiId.trim() || !/^[\w.-]+@[\w]+$/.test(upiId.trim())) {
        setUpiErr('Enter a valid UPI ID (e.g. 9876543210@paytm or name@okaxis)');
        return notify('Please enter a valid UPI ID', 'error');
      }
    }
    if (pay === 'Card / Net Banking') {
      const cErr: Record<string, string> = {};
      const cleanNum = card.number.replace(/\s/g, '');
      if (cleanNum.length < 16) cErr.number = 'Enter 16-digit card number';
      if (!card.name.trim()) cErr.name = 'Cardholder name required';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) cErr.expiry = 'MM/YY required';
      if (card.cvv.length < 3) cErr.cvv = '3-digit CVV required';
      setCardErr(cErr);
      if (Object.keys(cErr).length > 0) return notify('Please fill all card details properly', 'error');
    }

    setPlacing(true);

    const appName =
      upiApp === 'gpay' ? 'Google Pay' : upiApp === 'phonepe' ? 'PhonePe' : upiApp === 'paytm' ? 'Paytm' : 'UPI';
    const formattedMode =
      pay === 'UPI'
        ? `UPI (${appName}: ${upiId})`
        : pay === 'Card / Net Banking'
        ? `Card (${detectCardBrand(card.number)} ···· ${card.number.slice(-4) || '8888'})`
        : 'Cash on Delivery';

    setTimeout(() => {
      const order = placeOrder({
        buyerId: user?.id || 'u-buyer',
        buyerName: addr.name || user?.name || 'Customer',
        email: user?.email || (addr as any).email || '',
        phone: addr.phone || user?.phone || '',
        shipping: {
          address: addr.address,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
        },
        items: lines.map((l) => ({
          productId: l.productId,
          name: l.product.name,
          image: l.product.image,
          price: l.product.discountPrice,
          quantity: l.quantity,
        })),
        subtotal,
        delivery,
        total,
        paymentMode: formattedMode,
      });

      if (user && updateProfile) {
        updateProfile({
          phone: addr.phone,
          address: {
            address: addr.address,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
          },
        });
      }

      reduceStock(lines.map((l) => ({ productId: l.productId, quantity: l.quantity })));
      clear();
      setPlacing(false);
      closeQuickCheckout();
      notify(`Order ${order.id} placed successfully! 🎉`, 'success');

      if (user?.role === 'buyer') {
        navigate(`/buyer/track?id=${order.id}`);
      } else {
        navigate(`/buyer/orders`);
      }
    }, 600);
  };

  // Never render the floating cart bar or checkout dialog on auth pages (Login / Signup) or seller dashboard
  if (isAuthPage || isSeller) {
    return null;
  }

  return (
    <>
      {/* =========================================================================
          1. FLOATING BOTTOM BAR (Image 2 - Genuine floating card above bottom)
         ========================================================================= */}
      {lines.length > 0 && !quickCheckoutOpen && !isFullCheckout && (
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 'calc(12px + env(safe-area-inset-bottom, 0px))', sm: 20 },
            zIndex: 1150,
            ...(isDashboard
              ? {
                  left: { xs: 12, md: 'calc(264px + 28px)' },
                  right: { xs: 12, md: 28 },
                  maxWidth: { md: 980 },
                  mx: { md: 'auto' },
                }
              : {
                  left: { xs: 12, sm: '50%' },
                  right: { xs: 12, sm: 'auto' },
                  transform: { xs: 'none', sm: 'translateX(-50%)' },
                  width: { xs: 'calc(100% - 24px)', sm: 'auto' },
                  minWidth: { sm: 580, md: 740 },
                  maxWidth: 900,
                }),
            bgcolor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 12px 36px rgba(0,0,0,0.18), 0 2px 10px rgba(0,0,0,0.06)',
            py: { xs: 0.9, sm: 1.2 },
            px: { xs: 1.4, sm: 2.5 },
            transition: 'all 0.3s cubic-bezier(0.2, 0.7, 0.3, 1)',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            {/* Left: Up arrow button + "Your Order (X)" */}
            <Stack
              direction="row"
              spacing={{ xs: 0.8, sm: 1.2 }}
              alignItems="center"
              onClick={() => {
                setStep('cart');
                openQuickCheckout();
              }}
              sx={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <Box
                sx={{
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  bgcolor: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#374151',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: '#F3F4F6' },
                }}
              >
                <ChevronUp size={16} strokeWidth={2.5} />
              </Box>
              <Typography sx={{ fontSize: { xs: 13, sm: 15 }, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>
                Your Order ({count})
              </Typography>
            </Stack>

            {/* Right: Subtotal + Continue button */}
            <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
              <Typography sx={{ fontSize: { xs: 13, sm: 15 }, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>
                Total: {formatPrice(subtotal)}
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setStep('cart');
                  openQuickCheckout();
                }}
                sx={{
                  bgcolor: ACCENT_RED,
                  color: '#FFFFFF',
                  px: { xs: 1.8, sm: 3.5 },
                  py: 0.75,
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: { xs: 12.5, sm: 14 },
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: ACCENT_RED_HOVER, boxShadow: 'none' },
                }}
              >
                Continue
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      {/* =========================================================================
          2. EXPANDED DIALOG (Image 1 - "Your Orders" dialog & checkout)
         ========================================================================= */}
      <Dialog
        open={quickCheckoutOpen}
        onClose={closeQuickCheckout}
        maxWidth="sm"
        fullWidth
        scroll="paper"
        sx={{
          '& .MuiDialog-container': {
            alignItems: { xs: 'flex-end', sm: 'center' },
            justifyContent: 'center',
          },
          '& .MuiDialog-paper': {
            m: { xs: 0, sm: 2 },
            width: { xs: '100%', sm: '540px' },
            maxWidth: { xs: '100%', sm: '540px' },
            borderRadius: { xs: '20px 20px 0 0', sm: '16px' },
            height: { xs: '90vh', sm: 'auto' },
            maxHeight: { xs: '90dvh', sm: '90vh' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }}
      >
        {/* STEP 1: "Your Orders" list (Exact match to Image 1) */}
        {step === 'cart' && (
          <>
            {/* Header: Title + Close Icon */}
            <Box
              sx={{
                px: { xs: 2.5, sm: 3 },
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#FFFFFF',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
                Your Orders
              </Typography>
              <IconButton
                onClick={closeQuickCheckout}
                aria-label="close cart"
                size="small"
                sx={{ color: '#374151', '&:hover': { bgcolor: '#F3F4F6' } }}
              >
                <X size={20} />
              </IconButton>
            </Box>

            {/* Body: Items list with Veg indicator, item name, subtitle, price & stepper */}
            <DialogContent sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#FFFFFF', flexGrow: 1, overflowY: 'auto' }}>
              {!lines.length ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="#374151" fontWeight={600}>
                    Your cart is empty
                  </Typography>
                  <Typography fontSize={13.5} color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
                    Add organic sweets, snacks, and masalas to get started.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      closeQuickCheckout();
                      navigate('/buyer/browse');
                    }}
                    sx={{
                      borderRadius: '8px',
                      bgcolor: ACCENT_RED,
                      textTransform: 'none',
                      '&:hover': { bgcolor: ACCENT_RED_HOVER },
                    }}
                  >
                    Start Shopping
                  </Button>
                </Box>
              ) : (
                <Stack divider={<Divider sx={{ my: 1, borderColor: '#F3F4F6' }} />}>
                  {lines.map((l) => (
                    <Stack
                      key={l.productId}
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{ py: 1.2 }}
                    >
                      {/* Veg Green Icon */}
                      <VegIcon />

                      {/* Name & Subtitle */}
                      <Box sx={{ flexGrow: 1, minWidth: 0, pr: 1 }}>
                        <Typography
                          sx={{
                            fontSize: { xs: 14.5, sm: 15 },
                            fontWeight: 600,
                            color: '#111827',
                            lineHeight: 1.3,
                          }}
                        >
                          {l.product.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 12.5,
                            color: '#6B7280',
                            mt: 0.3,
                          }}
                        >
                          Quantity : {l.product.weight || '1 Pack'}
                        </Typography>
                      </Box>

                      {/* Right: Price & Stepper Pill */}
                      <Stack alignItems="flex-end" spacing={0.8} sx={{ flexShrink: 0 }}>
                        <Typography
                          sx={{
                            fontSize: { xs: 14, sm: 15 },
                            fontWeight: 600,
                            color: '#111827',
                          }}
                        >
                          {formatPrice(l.lineTotal)}
                        </Typography>

                        {/* Coral-Red Stepper [- qty +] */}
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            bgcolor: ACCENT_RED,
                            borderRadius: '6px',
                            height: 28,
                            px: 0.5,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (l.quantity <= 1) remove(l.productId);
                              else setQty(l.productId, l.quantity - 1);
                            }}
                            sx={{ p: 0.3, color: '#FFFFFF' }}
                            aria-label="decrease quantity"
                          >
                            <Minus size={13} strokeWidth={3} />
                          </IconButton>
                          <Typography
                            sx={{
                              minWidth: 20,
                              textAlign: 'center',
                              fontWeight: 700,
                              fontSize: 13,
                              color: '#FFFFFF',
                              px: 0.4,
                            }}
                          >
                            {l.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => setQty(l.productId, l.quantity + 1)}
                            disabled={l.quantity >= l.product.stock}
                            sx={{ p: 0.3, color: '#FFFFFF' }}
                            aria-label="increase quantity"
                          >
                            <Plus size={13} strokeWidth={3} />
                          </IconButton>
                        </Box>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              )}
            </DialogContent>

            {/* Bottom Bar: [v] Your Order (X) | Subtotal: ₹... | [Clear Cart] | [Continue] */}
            {lines.length > 0 && (
              <Box
                sx={{
                  px: { xs: 1.8, sm: 3 },
                  py: 1.2,
                  pb: { xs: 'calc(12px + env(safe-area-inset-bottom, 0px))', sm: 1.5 },
                  bgcolor: '#FFFFFF',
                  borderTop: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                {/* Left: Down arrow button + "Your Order (X)" on sm+ */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  onClick={closeQuickCheckout}
                  sx={{ cursor: 'pointer', userSelect: 'none', display: { xs: 'none', sm: 'flex' } }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      bgcolor: '#FFFFFF',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#374151',
                    }}
                  >
                    <ChevronDown size={18} strokeWidth={2.5} />
                  </Box>
                  <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: '#111827' }}>
                    Your Order ({count})
                  </Typography>
                </Stack>

                {/* Subtotal / Total */}
                <Typography sx={{ fontSize: { xs: 14.5, sm: 15 }, fontWeight: 700, color: '#111827' }}>
                  Total: {formatPrice(subtotal)}
                </Typography>

                {/* Right: Clear Cart + Continue */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      clear();
                      closeQuickCheckout();
                      notify('Cart cleared', 'info');
                    }}
                    sx={{
                      color: ACCENT_RED,
                      borderColor: '#FCA5A5',
                      borderRadius: '8px',
                      px: { xs: 1.4, sm: 1.8 },
                      py: 0.65,
                      fontSize: { xs: 12, sm: 13 },
                      fontWeight: 600,
                      textTransform: 'none',
                      whiteSpace: 'nowrap',
                      '&:hover': { bgcolor: '#FEE2E2', borderColor: ACCENT_RED },
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setStep('checkout')}
                    sx={{
                      bgcolor: ACCENT_RED,
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      px: { xs: 2.2, sm: 2.8 },
                      py: 0.7,
                      fontSize: { xs: 13, sm: 14 },
                      fontWeight: 700,
                      textTransform: 'none',
                      whiteSpace: 'nowrap',
                      boxShadow: 'none',
                      '&:hover': { bgcolor: ACCENT_RED_HOVER, boxShadow: 'none' },
                    }}
                  >
                    Continue
                  </Button>
                </Stack>
              </Box>
            )}
          </>
        )}

        {/* STEP 2: Checkout, Address & Payment */}
        {step === 'checkout' && (
          <>
            {/* Header with Back button */}
            <Box
              sx={{
                px: { xs: 1.5, sm: 3 },
                py: { xs: 1.2, sm: 1.8 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#FFFFFF',
                borderBottom: '1px solid #E5E7EB',
              }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <IconButton
                  size="small"
                  onClick={() => setStep('cart')}
                  sx={{ color: '#374151', p: 0.8 }}
                  aria-label="back to order"
                >
                  <ArrowLeft size={19} />
                </IconButton>
                <Typography sx={{ fontSize: { xs: 15.5, sm: 17 }, fontWeight: 700, color: '#111827' }}>
                  Delivery & Payment
                </Typography>
              </Stack>
              <IconButton
                onClick={closeQuickCheckout}
                aria-label="close"
                size="small"
                sx={{ color: '#374151' }}
              >
                <X size={20} />
              </IconButton>
            </Box>

            <DialogContent sx={{ p: { xs: 1.5, sm: 2.5 }, bgcolor: '#FAF7F0', flexGrow: 1, overflowY: 'auto' }}>
              <Stack spacing={2}>
                {/* Delivery Address Section with Manual Entry & Saved Options */}
                <Box sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                  <AddressSelector
                    value={addr}
                    onChange={(val) => setAddr((prev) => ({ ...prev, ...val }))}
                    errors={addrErr}
                    onClearError={(field) =>
                      setAddrErr((prev) => {
                        const next = { ...prev };
                        delete next[field];
                        return next;
                      })
                    }
                  />
                </Box>

                {/* Payment Selection Component */}
                <PaymentSelector
                  pay={pay}
                  setPay={setPay}
                  upiApp={upiApp}
                  setUpiApp={setUpiApp}
                  upiId={upiId}
                  setUpiId={setUpiId}
                  upiErr={upiErr}
                  card={card}
                  setCard={setCard}
                  cardErr={cardErr}
                  total={total}
                />

                {/* Bill Details */}
                <Box sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: '14px', bgcolor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                  <Typography fontSize={14} fontWeight={700} color="#111827" sx={{ mb: 1.2 }}>
                    Bill Summary
                  </Typography>
                  <Stack spacing={1} sx={{ fontSize: 13 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Item Total ({count} items)</Typography>
                      <Typography fontWeight={600}>{formatPrice(subtotal)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Delivery Fee</Typography>
                      <Typography fontWeight={600} color={delivery ? 'text.primary' : brand.leaf}>
                        {delivery ? formatPrice(delivery) : 'FREE'}
                      </Typography>
                    </Stack>
                    <Divider sx={{ my: 0.5 }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                      <Typography fontWeight={700} fontSize={15} color="#111827">
                        To Pay
                      </Typography>
                      <Typography fontWeight={800} fontSize={18} color="#111827">
                        {formatPrice(total)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>

            {/* Bottom Place Order Button */}
            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                pb: { xs: 'calc(16px + env(safe-area-inset-bottom, 8px))', sm: 2 },
                bgcolor: '#FFFFFF',
                borderTop: '1px solid #E5E7EB',
                boxShadow: '0 -4px 14px rgba(0,0,0,0.06)',
                flexShrink: 0,
              }}
            >
              <Button
                fullWidth
                variant="contained"
                disabled={placing}
                onClick={handlePlaceOrder}
                startIcon={<Lock size={16} />}
                sx={{
                  py: { xs: 1.4, sm: 1.4 },
                  bgcolor: ACCENT_RED,
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  fontSize: { xs: 14.5, sm: 15 },
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: ACCENT_RED_HOVER, boxShadow: 'none' },
                }}
              >
                {placing ? 'Placing Order…' : `Place Order · ${formatPrice(total)}`}
              </Button>
            </Box>
          </>
        )}
      </Dialog>
    </>
  );
}
