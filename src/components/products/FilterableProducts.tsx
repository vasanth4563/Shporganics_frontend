import { Box, Chip, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Product } from '../../types';
import { brand } from '../../theme/theme';
import { ProductGrid } from './ProductCard';

export type SortKey = 'popular' | 'low' | 'high' | 'discount';

/** Search + sub-category filter + sort, then renders the grid. */
export function FilterableProducts({
  products,
  loading,
  initialQuery = '',
}: {
  products: Product[];
  loading?: boolean;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [sub, setSub] = useState('All');
  const [sort, setSort] = useState<SortKey>('popular');

  const subs = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const s = p.subCategory ?? (p as any).sub_category;
      if (s) set.add(s);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const r = products.filter((p) => {
      const pSub = p.subCategory ?? (p as any).sub_category ?? '';
      const matchSub = sub === 'All' || pSub === sub;
      const matchQ =
        !q ||
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q);
      return matchSub && matchQ;
    });
    const sorted = [...r];
    if (sort === 'low') sorted.sort((a, b) => (a.discountPrice ?? a.price ?? 0) - (b.discountPrice ?? b.price ?? 0));
    else if (sort === 'high') sorted.sort((a, b) => (b.discountPrice ?? b.price ?? 0) - (a.discountPrice ?? a.price ?? 0));
    else if (sort === 'discount')
      sorted.sort((a, b) => {
        const da = ((a.price ?? 0) - (a.discountPrice ?? a.price ?? 0)) / (a.price || 1);
        const db = ((b.price ?? 0) - (b.discountPrice ?? b.price ?? 0)) / (b.price || 1);
        return db - da;
      });
    else sorted.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    return sorted;
  }, [products, query, sub, sort]);

  return (
    <Box sx={{ width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Search & Sort Controls */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2.5, width: '100%', minWidth: 0 }}
      >
        <TextField
          id="product-search"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          fullWidth
          sx={{ maxWidth: { xs: '100%', md: 360 }, minWidth: 0 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color={brand.muted} />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between" sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: 0 }}>
          <Typography sx={{ fontSize: 13.5, color: 'text.secondary', whiteSpace: 'nowrap' }}>
            {list.length} item{list.length === 1 ? '' : 's'}
          </Typography>
          <TextField
            id="product-sort"
            select
            size="small"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            sx={{ minWidth: { xs: 140, sm: 190 } }}
          >
            <MenuItem value="popular">Popularity</MenuItem>
            <MenuItem value="low">Price: Low to High</MenuItem>
            <MenuItem value="high">Price: High to Low</MenuItem>
            <MenuItem value="discount">Biggest Discount</MenuItem>
          </TextField>
        </Stack>
      </Stack>

      {/* Subcategory Filter Pills (Smooth Mobile Scrolling Tabs) */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 3,
          overflowX: 'auto',
          pb: 1,
          width: '100%',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {subs.map((s) => (
          <Chip
            key={s}
            label={s}
            onClick={() => setSub(s)}
            clickable
            sx={{
              px: { xs: 0.8, sm: 1.2 },
              height: { xs: 34, sm: 36 },
              borderRadius: 999,
              fontSize: { xs: 12.5, sm: 13.5 },
              fontWeight: 600,
              flexShrink: 0,
              transition: 'all 0.2s ease',
              ...(sub === s
                ? {
                    bgcolor: brand.green,
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(25,77,53,0.2)',
                    '&:hover': { bgcolor: brand.green },
                  }
                : {
                    bgcolor: '#fff',
                    border: `1px solid ${brand.line}`,
                    '&:hover': { bgcolor: brand.cream },
                  }),
            }}
          />
        ))}
      </Stack>

      <ProductGrid products={list} loading={loading} />
    </Box>
  );
}
