import {
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { LOW_STOCK } from '../../../utils/format';
import { useProducts, useToast } from '../../../hooks';
import type { Product } from '../../../types';
import SellerPanel from '../shared/SellerPanel';

/* =========================================================================
   3. MANAGE STOCK
   ========================================================================= */
const ManageStock = () => {
  const { products, updateProduct } = useProducts();
  const { notify } = useToast();

  const handleQuickAdd = (p: Product, delta: number) => {
    const nextStock = Math.max(0, p.stock + delta);
    updateProduct(p.id, { stock: nextStock });
    notify(`Updated stock for ${p.name} to ${nextStock}`);
  };

  return (
    <SellerPanel title="Stock & Inventory Control" subtitle="Quick replenishment and stock status tracking">
      <TableContainer>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Units in Stock</TableCell>
              <TableCell>Alert Status</TableCell>
              <TableCell align="right">Quick Replenish</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => {
              const isOut = p.stock === 0;
              const isLow = p.stock <= LOW_STOCK && !isOut;
              return (
                <TableRow key={p.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{p.category}</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>{p.stock}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={isOut ? 'Depleted' : isLow ? 'Needs Reorder' : 'Adequate'}
                      sx={{
                        bgcolor: isOut ? '#FEE2E2' : isLow ? '#FEF3C7' : '#DCFCE7',
                        color: isOut ? '#DC2626' : isLow ? '#D97706' : '#15803D',
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" variant="outlined" onClick={() => handleQuickAdd(p, 10)}>
                        +10
                      </Button>
                      <Button size="small" variant="outlined" onClick={() => handleQuickAdd(p, 25)}>
                        +25
                      </Button>
                      <Button size="small" variant="contained" onClick={() => handleQuickAdd(p, 50)}>
                        +50
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </SellerPanel>
  );
};

export default ManageStock;
