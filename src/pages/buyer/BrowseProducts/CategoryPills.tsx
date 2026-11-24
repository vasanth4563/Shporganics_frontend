import { Button, Stack } from '@mui/material';
import { brand } from '../../../theme/theme';
import { CATEGORIES } from '../../../utils/format';

interface CategoryPillsProps {
  active: string;
  onChange: (key: string) => void;
}

const CategoryPills = ({ active: activeKey, onChange }: CategoryPillsProps) => {
  return (
    // Category Pills Header with Smooth Mobile Touch Scroll
    <Stack
      direction="row"
      spacing={1}
      sx={{
        mb: 2.5,
        overflowX: 'auto',
        pb: 1,
        width: '100%',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {[{ key: 'all', label: 'All Products' }, ...CATEGORIES].map((c) => {
        const active = activeKey === c.key;
        return (
          <Button
            key={c.key}
            variant={active ? 'contained' : 'outlined'}
            onClick={() => onChange(c.key)}
            sx={{
              whiteSpace: 'nowrap',
              flexShrink: 0,
              borderRadius: 999,
              px: { xs: 2, sm: 2.5 },
              py: { xs: 0.7, sm: 0.9 },
              fontSize: { xs: 13, sm: 14 },
              fontWeight: 600,
              bgcolor: active ? brand.green : '#fff',
              borderColor: active ? brand.green : brand.line,
              color: active ? '#fff' : brand.text,
              boxShadow: active ? '0 4px 14px rgba(25, 77, 53, 0.2)' : 'none',
              '&:hover': {
                bgcolor: active ? brand.leaf : brand.cream,
                borderColor: active ? brand.leaf : brand.green,
              },
            }}
          >
            {c.label}
          </Button>
        );
      })}
    </Stack>
  );
};

export default CategoryPills;
