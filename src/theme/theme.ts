import { createTheme, alpha } from '@mui/material/styles';

export const brand = {
  green: '#194D35',
  leaf: '#568C3C',
  cream: '#F7F1E5',
  orange: '#E6A044',
  white: '#FFFFFF',
  text: '#292929',
  muted: '#6B6B66',
  line: '#ECE5D6',
};

export const theme = createTheme({
  palette: {
    primary: { main: brand.green, contrastText: '#fff' },
    secondary: { main: brand.leaf, contrastText: '#fff' },
    warning: { main: brand.orange },
    background: { default: '#FCFAF5', paper: '#FFFFFF' },
    text: { primary: brand.text, secondary: brand.muted },
    divider: brand.line,
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 600, letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 600, letterSpacing: '-0.02em' },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h5: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
    overline: { letterSpacing: '0.18em', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          overflowX: 'hidden',
          width: '100%',
          maxWidth: '100%',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, padding: '10px 22px', transition: 'all .25s ease' },
        containedPrimary: { '&:hover': { backgroundColor: '#123A28', transform: 'translateY(-1px)' } },
        outlined: { borderWidth: 1.5, '&:hover': { borderWidth: 1.5 } },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 20, border: `1px solid ${brand.line}`, boxShadow: '0 1px 2px rgba(25,77,53,0.04)' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#fff',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: brand.line },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(brand.green, 0.4) },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600, color: brand.muted, fontSize: 13, backgroundColor: '#FBF8F1' },
        root: { borderColor: brand.line },
      },
    },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 20 } } },
  },
});
