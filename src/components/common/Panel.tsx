import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { brand } from '../../theme/theme';

interface PanelProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

const Panel = ({ title, action, children }: PanelProps) => {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        bgcolor: '#fff',
        borderRadius: { xs: '20px', sm: '24px' },
        border: `1px solid ${brand.line}`,
        height: '100%',
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 2px 10px rgba(25, 77, 53, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 2, minWidth: 0, width: '100%' }}>
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Fraunces", serif', color: brand.green, fontSize: { xs: 18, sm: 20 }, fontWeight: 600, flex: '1 1 auto', minWidth: 0 }}
          noWrap
        >
          {title}
        </Typography>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Stack>
      <Box sx={{ flexGrow: 1, width: '100%', minWidth: 0 }}>{children}</Box>
    </Box>
  );
};

export default Panel;
