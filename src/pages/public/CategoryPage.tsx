import { Box, Breadcrumbs, Container, Typography } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import type { Category } from '../../types';
import { brand } from '../../theme/theme';
import { CATEGORIES } from '../../utils/format';
import { FilterableProducts } from '../../components/products/FilterableProducts';
import { useProducts } from '../../hooks';

function PageHero({ title, blurb, crumb }: { title: string; blurb: string; crumb: string }) {
  return (
    <Box sx={{ bgcolor: brand.cream, py: { xs: 6, md: 9 }, borderBottom: `1px solid ${brand.line}` }}>
      <Container maxWidth="xl">
        <Breadcrumbs sx={{ mb: 2, fontSize: 14 }}>
          <Box component={Link} to="/" sx={{ color: 'text.secondary', textDecoration: 'none' }}>Home</Box>
          <Typography fontSize={14} color={brand.green} fontWeight={600}>{crumb}</Typography>
        </Breadcrumbs>
        <Typography variant="h1" sx={{ fontSize: { xs: 40, md: 60 }, color: brand.green }}>{title}</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1.5, fontSize: 17, maxWidth: 560 }}>{blurb}</Typography>
      </Container>
    </Box>
  );
}

export function CategoryPage({ category }: { category: Category }) {
  const { products, loading } = useProducts();
  const meta = CATEGORIES.find((c) => c.key === category)!;
  return (
    <>
      <PageHero title={meta.label} blurb={meta.blurb + ' — 100% organic, made fresh for every order.'} crumb={meta.label} />
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        <FilterableProducts key={category} products={products.filter((p) => p.category === category)} loading={loading} />
      </Container>
    </>
  );
}

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const { products, loading } = useProducts();
  return (
    <>
      <PageHero title={q ? `Results for “${q}”` : 'All products'} blurb="Browse our complete range of traditional Podi varieties, crispy snacks, and homemade sweets." crumb="Search" />
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        <FilterableProducts key={q} products={products} loading={loading} initialQuery={q} />
      </Container>
    </>
  );
}
