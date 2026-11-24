import { Box, Button, Container, Divider, Stack, Typography } from '@mui/material';
import { ArrowLeft, Lock, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItemRow, SummaryCard } from '../../../components/cart/CartComponents';
import { ConfirmDialog, EmptyState } from '../../../components/common';
import { brand } from '../../../theme/theme';
import { useCart, useToast } from '../../../hooks';

interface CartPageProps {
  dashboard?: boolean;
}

const CartPage = ({ dashboard = false }: CartPageProps) => {
  const { lines, setQty, remove, subtotal, delivery, total, clear, count } = useCart();
  const navigate = useNavigate();
  const { notify } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);
  const shop = dashboard ? '/buyer/browse' : '/';

  const content = !lines.length ? (
    <Box sx={{ bgcolor: '#fff', borderRadius: 5, border: `1px solid ${brand.line}`, width: '100%' }}>
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        message="Looks like you haven't added anything yet. Explore our fresh organic range."
        action={<Button variant="contained" onClick={() => navigate(shop)}>Start shopping</Button>}
      />
    </Box>
  ) : (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 360px', lg: '1fr 400px' }, gap: { xs: 2.5, md: 4 }, width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ bgcolor: '#fff', borderRadius: 5, border: `1px solid ${brand.line}`, px: { xs: 2, sm: 3.5 }, py: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 2 }}>
            <Typography fontWeight={600}>{count} item{count > 1 ? 's' : ''}</Typography>
            <Button size="small" color="error" onClick={() => setConfirmClear(true)}>Clear cart</Button>
          </Stack>
          <Divider />
          {lines.map((l, i) => (
            <Box key={l.productId}>
              <CartItemRow line={l} onQty={(q) => setQty(l.productId, q)} onRemove={() => { remove(l.productId); notify(`${l.product.name} removed`, 'info'); }} />
              {i < lines.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
        <Button startIcon={<ArrowLeft size={17} />} onClick={() => navigate(shop)} sx={{ mt: 2, color: brand.green }} id="continue-shopping">Continue shopping</Button>
      </Box>
      <Box sx={{ width: '100%' }}>
        <SummaryCard subtotal={subtotal} delivery={delivery} total={total}>
          <Button id="proceed-checkout" fullWidth size="large" variant="contained" startIcon={<Lock size={16} />} onClick={() => navigate('/buyer/checkout')} sx={{ py: 1.5 }}>Proceed to checkout</Button>
          <Button fullWidth variant="text" onClick={() => navigate(shop)} sx={{ mt: 1, color: brand.green }}>Continue shopping</Button>
        </SummaryCard>
      </Box>
    </Box>
  );

  return (
    <>
      {dashboard ? content : (
        <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 36, md: 48 }, color: brand.green, mb: 4 }}>Your cart</Typography>
          {content}
        </Container>
      )}
      <ConfirmDialog open={confirmClear} title="Clear your cart?" message="All items will be removed from your cart." confirmText="Clear cart"
        onConfirm={() => { clear(); notify('Cart cleared', 'info'); }} onClose={() => setConfirmClear(false)} />
    </>
  );
};

export default CartPage;
