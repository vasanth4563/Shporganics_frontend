import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Edit, Filter, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ConfirmDialog, SmartImage } from '../../../components/common';
import { brand } from '../../../theme/theme';
import { CATEGORIES, formatPrice, LOW_STOCK } from '../../../utils/format';
import { useProducts, useToast } from '../../../hooks';
import type { Category, Product } from '../../../types';
import SellerPanel from '../shared/SellerPanel';
import ProductFormDialog, { type ProductFormValues } from './ProductFormDialog';

/* =========================================================================
   2. SELLER PRODUCT MANAGEMENT (CRUD)
   ========================================================================= */
const SellerProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { notify } = useToast();

  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State – starts empty so sellers enter their own product details
  const defaultForm: ProductFormValues = {
    name: '',
    category: (CATEGORIES[0]?.key ?? 'sweets') as Category,
    subCategory: '',
    description: '',
    price: 0,
    discountPrice: 0,
    stock: 0,
    weight: '',
    image: '',
    featured: false,
    bestSeller: false,
  };
  const [form, setForm] = useState<ProductFormValues>(defaultForm);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCat === 'all' || p.category === selectedCat;
      const matchQ =
        !query.trim() ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [products, query, selectedCat]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      subCategory: p.subCategory,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      stock: p.stock,
      weight: p.weight,
      image: p.image,
      featured: p.featured ?? false,
      bestSeller: p.bestSeller ?? false,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return notify('Product name is required', 'error');
    if (!form.image) return notify('Please upload a product image', 'error');
    if (!form.weight.trim()) return notify('Weight / size is required', 'error');
    if (!(form.price > 0)) return notify('Enter a valid MRP', 'error');
    if (!(form.discountPrice > 0)) return notify('Enter a valid selling price', 'error');
    if (form.discountPrice > form.price) return notify('Selling price cannot be higher than MRP', 'error');

    const payload = {
      ...form,
      name: form.name.trim(),
      subCategory: form.subCategory.trim() || form.category,
      weight: form.weight.trim(),
    };

    const ok = editingId ? await updateProduct(editingId, payload) : await addProduct(payload);

    if (!ok) return notify('Could not save product. Please check the details and try again.', 'error');
    notify(editingId ? `Updated "${payload.name}" successfully!` : `Added "${payload.name}" to inventory!`);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      const ok = await deleteProduct(deleteConfirmId);
      notify(ok ? 'Product removed successfully' : 'Could not delete product', ok ? 'success' : 'error');
      setDeleteConfirmId(null);
    }
  };

  return (
    <Stack spacing={3}>
      <SellerPanel
        title="Product Inventory"
        subtitle={`Managing ${products.length} catalog items`}
        action={
          <Button
            id="seller-add-product-btn"
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={handleOpenAdd}
          >
            Add New Product
          </Button>
        }
      >
        {/* Search & Filter Toolbar */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            id="seller-search-products"
            placeholder="Search by product name..."
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color={brand.muted} />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            size="small"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            sx={{ minWidth: 180 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Filter size={16} />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {CATEGORIES.map((c) => (
              <MenuItem key={c.key} value={c.key}>
                {c.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {/* Products Table */}
        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>MRP</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock Qty</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((p) => {
                const isOutOfStock = p.stock === 0;
                const isLow = p.stock <= LOW_STOCK && !isOutOfStock;

                return (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <SmartImage src={p.image} alt={p.name} sx={{ width: 44, height: 44, borderRadius: 2 }} />
                        <Box>
                          <Typography fontWeight={600} fontSize={14}>
                            {p.name}
                          </Typography>
                          <Typography fontSize={12} color="text.secondary">
                            {p.weight}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={13.5} textTransform="capitalize">
                        {p.category}
                      </Typography>
                      <Typography fontSize={12} color="text.secondary">
                        {p.subCategory}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                      {formatPrice(p.price)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: brand.green }}>
                      {formatPrice(p.discountPrice)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{p.stock} units</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={isOutOfStock ? 'Out of stock' : isLow ? 'Low stock' : 'In stock'}
                        sx={{
                          bgcolor: isOutOfStock ? '#FEE2E2' : isLow ? '#FEF3C7' : '#DCFCE7',
                          color: isOutOfStock ? '#DC2626' : isLow ? '#D97706' : '#15803D',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleOpenEdit(p)}>
                        <Edit size={16} />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => setDeleteConfirmId(p.id)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </SellerPanel>

      {/* Add / Edit Product Modal */}
      <ProductFormDialog
        open={modalOpen}
        isEditing={!!editingId}
        form={form}
        setForm={setForm}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirmId}
        title="Delete this product?"
        message="This action removes the product from the store catalog."
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteConfirmId(null)}
      />
    </Stack>
  );
};

export default SellerProducts;
