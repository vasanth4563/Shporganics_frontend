import { AppBar, Avatar, Badge, Box, Button, Container, Divider, Drawer, IconButton, InputBase, List, ListItemButton, ListItemText, Menu, MenuItem, Stack, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, Search, ShoppingBag, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import { brand } from '../../theme/theme';
import { useAuth, useCart, useToast } from '../../hooks';

export const NAV = [
  { label: 'Home', to: '/store' },
  { label: 'Podi Varieties', to: '/podi' },
  { label: 'Snacks', to: '/snacks' },
  { label: 'Sweets', to: '/sweets' },
  { label: 'Additional Snacks', to: '/additional-snacks' },
  { label: 'Contact Us', to: '/contact' },
];

export default function Header() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const { count, openQuickCheckout } = useCart();
  const { user, logout } = useAuth();
  const { notify } = useToast();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  const dash = user?.role === 'seller' ? '/seller' : '/buyer';
  const doLogout = () => { logout(); setAnchor(null); setOpen(false); notify('Logged out successfully'); navigate('/'); };

  const searchBox = (
    <Box component="form" onSubmit={submit} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.8, height: 42, borderRadius: 999,
      bgcolor: brand.cream, border: '1px solid transparent', transition: 'all .2s', '&:focus-within': { borderColor: brand.leaf, bgcolor: '#fff' }, width: { xs: '100%', lg: 220, xl: 260 } }}>
      <Search size={17} color={brand.muted} />
      <InputBase id="header-search" placeholder="Search organic goodness" value={q} onChange={(e) => setQ(e.target.value)} sx={{ fontSize: 14, flex: 1 }} inputProps={{ 'aria-label': 'search products' }} />
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#FCFAF5', borderBottom: `1px solid ${brand.line}`, color: brand.text, zIndex: 1100 }}>
      <Box sx={{ bgcolor: brand.green, color: brand.cream, textAlign: 'center', py: 0.8, fontSize: 12.5, letterSpacing: '.04em' }}>
        Free delivery on orders above ₹499 · 100% certified organic
      </Box>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 68, md: 76 }, gap: 2 }}>
          <Logo to={user ? (user.role === 'seller' ? '/seller' : '/buyer') : '/login'} />
          {!mobile && (
            <Stack direction="row" spacing={0.5} sx={{ mx: 'auto' }}>
              {NAV.map((n) => (
                <Box key={n.to} component={NavLink} to={n.to} end={n.to === '/store'}
                  sx={{ px: 1.5, py: 1, fontSize: 14.5, fontWeight: 500, color: brand.text, textDecoration: 'none', position: 'relative', whiteSpace: 'nowrap',
                    '&::after': { content: '""', position: 'absolute', left: 12, right: 12, bottom: 2, height: 2, borderRadius: 2, bgcolor: brand.orange, transform: 'scaleX(0)', transition: 'transform .25s' },
                    '&:hover::after, &.active::after': { transform: 'scaleX(1)' }, '&.active': { color: brand.green, fontWeight: 600 } }}>
                  {n.label}
                </Box>
              ))}
            </Stack>
          )}
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ ml: mobile ? 'auto' : 0 }}>
            {!mobile && searchBox}
            <IconButton
              id="header-cart"
              aria-label="cart"
              onClick={() => openQuickCheckout()}
              sx={{ bgcolor: '#fff', border: `1px solid ${brand.line}` }}
            >
              <Badge badgeContent={count} color="warning" sx={{ '& .MuiBadge-badge': { fontWeight: 700, color: '#fff' } }}>
                <ShoppingBag size={20} />
              </Badge>
            </IconButton>
            {!mobile && (user ? (
              <>
                <IconButton onClick={(e) => setAnchor(e.currentTarget)} id="header-account" aria-label="account menu">
                  <Avatar sx={{ bgcolor: brand.green, width: 38, height: 38, fontSize: 15 }}>{user?.name?.[0] || 'U'}</Avatar>
                </IconButton>
                <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} PaperProps={{ sx: { mt: 1, minWidth: 200, borderRadius: 3 } }}>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography fontWeight={600}>{user?.name || 'User'}</Typography>
                    <Typography fontSize={12.5} color="text.secondary" textTransform="capitalize">{user?.role || 'Account'}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => { setAnchor(null); navigate(dash); }}><LayoutDashboard size={16} style={{ marginRight: 10 }} />Dashboard</MenuItem>
                  <MenuItem onClick={doLogout}><LogOut size={16} style={{ marginRight: 10 }} />Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button id="header-login" variant="text" onClick={() => navigate('/login')} sx={{ color: brand.green }}>Login</Button>
                <Button id="header-signup" variant="contained" onClick={() => navigate('/signup')}>Sign Up</Button>
              </>
            ))}
            {mobile && (
              <IconButton aria-label="open menu" onClick={() => setOpen(true)}><MenuIcon /></IconButton>
            )}
          </Stack>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 320, p: 2.5, bgcolor: '#FCFAF5' } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Logo to={user ? (user.role === 'seller' ? '/seller' : '/buyer') : '/login'} />
          <IconButton onClick={() => setOpen(false)} aria-label="close menu"><X /></IconButton>
        </Stack>
        {searchBox}
        <List sx={{ mt: 2 }}>
          {NAV.map((n) => (
            <ListItemButton key={n.to} component={NavLink} to={n.to} end={n.to === '/store'} onClick={() => setOpen(false)}
              sx={{ borderRadius: 3, '&.active': { bgcolor: brand.cream, color: brand.green, fontWeight: 600 } }}>
              <ListItemText primary={n.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
      </Drawer>
    </AppBar>
  );
}
