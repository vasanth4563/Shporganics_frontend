import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { FilterableProducts } from '../../../components/products/FilterableProducts';
import { useProducts } from '../../../hooks';
import type { Category } from '../../../types';
import CategoryPills from './CategoryPills';

const BrowseProducts = () => {
  const { products, loading } = useProducts();
  const [params, setParams] = useSearchParams();
  const cat = (params.get('cat') as Category | null) ?? 'all';
  const list = cat === 'all' ? products : products.filter((p) => p.category === cat);

  return (
    <Box sx={{ width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <CategoryPills active={cat} onChange={(key) => setParams(key === 'all' ? {} : { cat: key })} />
      <FilterableProducts key={cat} products={list} loading={loading} />
    </Box>
  );
};

export default BrowseProducts;
