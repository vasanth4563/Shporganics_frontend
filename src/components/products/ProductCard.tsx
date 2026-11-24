import { Box, Button, Card, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../../types';
import { brand } from '../../theme/theme';
import { discountPercent, formatPrice } from '../../utils/format';
import { QuantitySelector, SmartImage, EmptyState } from '../common';
import { useCart, useToast } from '../../hooks';

export function ProductCard({ product }: { product: Product }) {
  const { add, items, openQuickCheckout } = useCart();
  const { notify } = useToast();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const inCart = items.find((i) => i.productId === product.id)?.quantity ?? 0;
  const available = (product.stock ?? 50) - inCart;
  const out = (product.stock ?? 50) === 0;
  const discountPrice = product.discountPrice ?? (product as any).discount_price ?? product.price;
  const originalPrice = product.price ?? discountPrice;
  const off = discountPercent(originalPrice, discountPrice);
  const subCategory = product.subCategory ?? (product as any).sub_category ?? '';

  const handleAdd = () => {
    if (available <= 0) return notify('Maximum available stock already in your cart', 'warning');
    add(product.id, Math.min(qty, available));
    notify(`${product.name} added to cart`);
    setAdded(true);
    setQty(1);
    setTimeout(() => setAdded(false), 1400);
    openQuickCheckout();
  };

  return (
    <Card
      sx={{
        height: '100%',
        width: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: { xs: '16px', sm: '22px' },
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(25, 77, 53, 0.05)',
        border: `1px solid ${brand.line}`,
        transition: 'all 0.35s cubic-bezier(0.2, 0.7, 0.3, 1)',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 16px 36px rgba(25, 77, 53, 0.12)',
          '& img': { transform: 'scale(1.05)' },
        },
      }}
    >
      {/* Product Image & Badges */}
      <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: brand.cream, height: { xs: 130, sm: 160, md: 180 }, width: '100%' }}>
        <SmartImage
          src={product.image}
          alt={product.name}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
        />
        {off > 0 && (
          <Chip
            label={`${off}% OFF`}
            size="small"
            sx={{
              position: 'absolute',
              top: { xs: 6, sm: 12 },
              left: { xs: 6, sm: 12 },
              bgcolor: brand.orange,
              color: '#fff',
              fontSize: { xs: 9.5, sm: 11.5 },
              height: { xs: 20, sm: 26 },
              fontWeight: 700,
            }}
          />
        )}
        <Chip
          label={product.weight}
          size="small"
          sx={{
            position: 'absolute',
            top: { xs: 6, sm: 12 },
            right: { xs: 6, sm: 12 },
            bgcolor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(6px)',
            fontSize: { xs: 9.5, sm: 11.5 },
            height: { xs: 20, sm: 26 },
            fontWeight: 600,
          }}
        />
        {out && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(2px)',
              display: 'grid',
              placeItems: 'center',
              zIndex: 2,
            }}
          >
            <Chip
              label="Sold Out"
              size="small"
              sx={{ bgcolor: '#C4462B', color: '#fff', fontWeight: 700, fontSize: { xs: 10, sm: 11.5 } }}
            />
          </Box>
        )}
      </Box>

      {/* Product Info & Action */}
      <Stack sx={{ p: { xs: 1.25, sm: 2 }, flexGrow: 1 }} spacing={{ xs: 0.6, sm: 1.1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{
              fontSize: { xs: 10, sm: 11.5 },
              color: brand.leaf,
              fontWeight: 700,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
            }}
            noWrap
          >
            {subCategory}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.3}>
            <Star size={11} fill={brand.orange} color={brand.orange} />
            <Typography sx={{ fontSize: { xs: 11, sm: 12.5 }, fontWeight: 700 }}>
              {Number(product.rating || 4.8).toFixed(1)}
            </Typography>
          </Stack>
        </Stack>

        <Typography
          sx={{
            fontFamily: '"Fraunces", serif',
            fontSize: { xs: 13.5, sm: 17 },
            fontWeight: 600,
            color: brand.text,
            lineHeight: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Typography>

        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: 11, sm: 12.5 },
            lineHeight: 1.4,
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </Typography>

        {/* Pricing */}
        <Stack direction="row" alignItems="baseline" spacing={0.6} flexWrap="wrap">
          <Typography sx={{ fontSize: { xs: 15, sm: 20 }, fontWeight: 700, color: brand.green }}>
            {formatPrice(discountPrice)}
          </Typography>
          {off > 0 && (
            <Typography sx={{ fontSize: { xs: 11, sm: 13 }, color: 'text.secondary', textDecoration: 'line-through' }}>
              {formatPrice(originalPrice)}
            </Typography>
          )}
        </Stack>

        {/* Action Controls */}
        <Stack direction="row" spacing={0.8} alignItems="center" sx={{ pt: 0.3, width: '100%', minWidth: 0 }}>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <QuantitySelector value={qty} onChange={setQty} max={Math.max(1, available)} size="sm" />
          </Box>
          <Button
            fullWidth
            variant="contained"
            disabled={out}
            onClick={handleAdd}
            id={`add-to-cart-${product.id}`}
            startIcon={added ? <Check size={14} /> : <ShoppingBag size={14} />}
            sx={{
              py: { xs: 0.65, sm: 0.85 },
              px: { xs: 1, sm: 2 },
              fontSize: { xs: 11.5, sm: 13.5 },
              borderRadius: 999,
              minWidth: 0,
              ...(added && { bgcolor: brand.leaf }),
            }}
          >
            {out ? 'Sold out' : added ? 'Added' : 'Add to Cart'}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export function ProductGrid({
  products,
  loading,
  cols = 4,
}: {
  products: Product[];
  loading?: boolean;
  cols?: 3 | 4;
}) {
  if (loading)
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: cols === 4 ? 'repeat(4, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
          },
          gap: { xs: 1.5, sm: 2.5 },
          width: '100%',
        }}
      >
        {Array.from({ length: cols * 2 }).map((_, i) => (
          <Box key={i} sx={{ width: '100%' }}>
            <Skeleton variant="rounded" sx={{ height: { xs: 140, sm: 190 }, borderRadius: 3 }} />
            <Skeleton width="60%" sx={{ mt: 1.2 }} />
            <Skeleton width="90%" />
            <Skeleton width="40%" />
          </Box>
        ))}
      </Box>
    );
  if (!products.length)
    return (
      <EmptyState
        title="No products found"
        message="Try adjusting your search or filters to find what you're looking for."
      />
    );
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: cols === 4 ? 'repeat(4, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
        },
        gap: { xs: 1.5, sm: 2.5 },
        width: '100%',
      }}
    >
      {products.map((p) => (
        <Box key={p.id} sx={{ width: '100%', minWidth: 0 }}>
          <ProductCard product={p} />
        </Box>
      ))}
    </Box>
  );
}
