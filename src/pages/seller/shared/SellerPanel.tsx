import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { brand } from '../../../theme/theme';

interface SellerPanelProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

/* Helper Container */
const SellerPanel = ({ title, subtitle, action, children }: SellerPanelProps) => {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        bgcolor: '#FFFFFF',
        borderRadius: { xs: '18px', sm: '24px' },
        border: `1px solid ${brand.line}`,
        mb: { xs: 2, sm: 3 },
        boxShadow: '0 2px 8px rgba(25, 77, 53, 0.04)',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Fraunces", serif',
              color: brand.green,
              fontSize: { xs: 18, sm: 20 },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12.5, sm: 14 } }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
      {children}
    </Box>
  );
};

export default SellerPanel;
