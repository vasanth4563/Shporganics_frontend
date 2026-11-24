import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Image as ImageIcon, UploadCloud } from 'lucide-react';
import React, { useState } from 'react';
import { SmartImage } from '../../../components/common';
import { brand } from '../../../theme/theme';
import { CATEGORIES } from '../../../utils/format';
import type { Category } from '../../../types';

export interface ProductFormValues {
  name: string;
  category: Category;
  subCategory: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  weight: string;
  image: string;
  featured: boolean;
  bestSeller: boolean;
}

interface ProductFormDialogProps {
  open: boolean;
  isEditing: boolean;
  form: ProductFormValues;
  setForm: React.Dispatch<React.SetStateAction<ProductFormValues>>;
  onClose: () => void;
  onSave: () => void;
}

/** Compresses images client-side before uploading as base64 */
const compressImage = (file: File, maxDim = 800, quality = 0.82): Promise<string> => {
  return new Promise((resolve) => {
    // If it's SVG, keep as data URL directly
    if (file.type.includes('svg')) {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(e.target?.result as string);
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

/* Add / Edit Product Modal */
const ProductFormDialog = ({ open, isEditing, form, setForm, onClose, onSave }: ProductFormDialogProps) => {
  const [compressing, setCompressing] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompressing(true);
      try {
        const compressedBase64 = await compressImage(file);
        setForm((prev) => ({ ...prev, image: compressedBase64 }));
      } finally {
        setCompressing(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Fraunces", serif', color: brand.green }}>
        {isEditing ? 'Edit Product' : 'Add New Organic Product'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Image Preview & Upload / URL */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: '#FAF7F0',
                border: '1px dashed #D1D5DB',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                {form.image ? (
                  <SmartImage
                    src={form.image}
                    alt="Preview"
                    sx={{ width: 84, height: 84, borderRadius: 2.5, objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 84,
                      height: 84,
                      borderRadius: 2.5,
                      bgcolor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#9CA3AF',
                      flexShrink: 0,
                    }}
                  >
                    <ImageIcon size={32} />
                  </Box>
                )}

                <Box sx={{ flexGrow: 1, width: '100%' }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
                    <Button
                      variant="contained"
                      component="label"
                      size="small"
                      disabled={compressing}
                      startIcon={<UploadCloud size={16} />}
                      sx={{
                        bgcolor: brand.green,
                        '&:hover': { bgcolor: brand.leaf },
                        textTransform: 'none',
                        borderRadius: 2,
                      }}
                    >
                      {compressing ? 'Optimizing…' : 'Upload Image'}
                      <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                    </Button>
                    {form.image && (
                      <Button
                        variant="text"
                        size="small"
                        color="error"
                        onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
                        sx={{ fontSize: 12, textTransform: 'none' }}
                      >
                        Remove
                      </Button>
                    )}
                  </Stack>
                  <Typography fontSize={11.5} color="text.secondary" sx={{ mt: 0.6, mb: 1 }}>
                    Upload PNG, JPG, WebP from your device (auto-optimized for web)
                  </Typography>

                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Or paste an image URL (https://...)"
                    value={form.image.startsWith('data:') ? '' : form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    sx={{ bgcolor: '#FFFFFF', borderRadius: 1 }}
                  />
                </Box>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              id="form-product-name"
              fullWidth
              label="Product Name"
              placeholder="e.g. Traditional Pure Ghee Laddu"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Weight / Size"
              placeholder="e.g. 500 g"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c.key} value={c.key}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sub-Category"
              placeholder="e.g. Laddu, Halwa, Podi, Mixture"
              value={form.subCategory}
              onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              placeholder="e.g. Handcrafted using certified organic ingredients, cold-pressed oils, and pure desi cow ghee."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Original MRP (₹)"
              placeholder="0"
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Discount Price (₹)"
              placeholder="0"
              value={form.discountPrice || ''}
              onChange={(e) => setForm({ ...form, discountPrice: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Available Stock"
              placeholder="0"
              value={form.stock || ''}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button id="form-save-product-btn" variant="contained" onClick={onSave}>
          Save Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormDialog;
