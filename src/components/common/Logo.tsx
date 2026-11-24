import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import logoUrl from '@brand-logo';
import { brand } from '../../theme/theme';

/**
 * SHP Organics logo — original uploaded logo image (unedited) in a circle,
 * followed by the "SHP Organics" wordmark.
 */
export default function Logo({
  light = false,
  to = '/',
  size = 'md',
}: {
  light?: boolean;
  to?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'horizontal';
}) {
  const d = size === 'sm' ? 52 : size === 'lg' ? 72 : 62;

  return (
    <Box
      component={Link}
      to={to}
      aria-label="SHP Organics home"
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.3, textDecoration: 'none', userSelect: 'none' }}
    >
      {/* White circle; the full logo image is scaled to fit inside so no lettering is clipped */}
      <Box
        sx={{
          width: d,
          height: d,
          borderRadius: '50%',
          bgcolor: '#FFFFFF',
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={logoUrl}
          alt="SHP Organics"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            height: '108%',
            width: 'auto',
            transform: 'translate(-50%, -50%)',
            display: 'block',
          }}
        />
      </Box>
      <Typography
        sx={{
          fontFamily: '"Fraunces", serif',
          fontWeight: 700,
          fontSize: size === 'sm' ? 19 : size === 'lg' ? 26 : 23,
          color: light ? '#FFFFFF' : brand.green,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        SHP Organics
      </Typography>
    </Box>
  );
}
