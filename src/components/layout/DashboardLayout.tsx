import { Avatar, Badge, Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Bell, LogOut, Menu as MenuIcon, ShoppingBag, Store, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import { ConfirmDialog } from '../common';
import { brand } from '../../theme/theme';
import { useAuth, useCart, useToast } from '../../hooks';

export interface SideItem { label: string; to: string; icon: LucideIcon; end?: boolean }

const W = 264;

export default function DashboardLayout({ items, title }: { items: SideItem[]; title: string }) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const { user, logout } = useAuth();
  const { count, openQuickCheckout } = useCart();
  const { notify } = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); window.scrollTo({ top: 0 }); }, [pathname]);

  const current = [...items].sort((a, b) => b.to.length - a.to.length).find((i) => pathname.startsWith(i.to));

  const doLogout = () => { logout(); notify('You have been logged out'); navigate('/login'); };

  const sidebar = (
    <Stack sx={{ height: '100%', p: 2.5, bgcolor: brand.green, color: brand.cream, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
      <Box sx={{ px: 0.5, mb: 3.5, mt: 0.5 }}>
        <Logo light to={user?.role === 'seller' ? '/seller' : '/buyer'} size="md" />
      </Box>
      <Typography sx={{ px: 1.5, mb: 1, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', opacity: 0.55 }}>{title}</Typography>
      <List sx={{ flexGrow: 1 }}>
        {items.map((it) => (
          <ListItemButton key={it.to} component={NavLink} to={it.to} end={it.end}
            sx={{ borderRadius: 3, mb: 0.5, py: 1.1, color: 'rgba(247,241,229,.78)', transition: 'all .2s',
              '&:hover': { bgcolor: 'rgba(255,255,255,.07)', color: '#fff' },
              '&.active': { bgcolor: brand.cream, color: brand.green, fontWeight: 600, '& .MuiListItemIcon-root': { color: brand.green } } }}>
            <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}><it.icon size={19} /></ListItemIcon>
            <ListItemText primary={it.label} primaryTypographyProps={{ fontSize: 14.5, fontWeight: 'inherit' }} />
          </ListItemButton>
        ))}
        <ListItemButton id="sidebar-logout" onClick={() => setConfirm(true)} sx={{ borderRadius: 3, py: 1.1, color: 'rgba(247,241,229,.78)', '&:hover': { bgcolor: 'rgba(255,255,255,.07)', color: '#fff' } }}>
          <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}><LogOut size={19} /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14.5 }} />
        </ListItemButton>
      </List>
      <Box sx={{ p: 2, borderRadius: 4, bgcolor: 'rgba(255,255,255,.07)', mt: 'auto' }}>
        <Typography sx={{ fontSize: 13, opacity: .8 }}>Need help?</Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>hello@shporganics.in</Typography>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#F8F5EE', width: '100%', overflow: 'hidden' }}>
      {mobile ? (
        <Drawer open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: W, border: 0 } }}>{sidebar}</Drawer>
      ) : (
        <Box sx={{ width: W, flexShrink: 0, height: '100vh', overflow: 'hidden' }}>{sidebar}</Box>
      )}
      <Box sx={{ flexGrow: 1, minWidth: 0, width: '100%', maxWidth: '100%', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ px: { xs: 2, md: 4 }, height: 72, flexShrink: 0,
          bgcolor: '#F8F5EE', borderBottom: `1px solid ${brand.line}`, width: '100%', boxSizing: 'border-box', zIndex: 10 }}>
          {mobile && <IconButton aria-label="open sidebar" onClick={() => setOpen(true)}><MenuIcon /></IconButton>}
          <Typography variant="h5" sx={{ color: brand.green, fontSize: { xs: 20, md: 24 }, flexGrow: 1 }} noWrap>{current?.label ?? title}</Typography>
          {user?.role === 'buyer' ? (
            <IconButton aria-label="cart" onClick={() => openQuickCheckout()} sx={{ bgcolor: '#fff', border: `1px solid ${brand.line}` }}>
              <Badge badgeContent={count} color="warning" sx={{ '& .MuiBadge-badge': { color: '#fff' } }}><ShoppingBag size={19} /></Badge>
            </IconButton>
          ) : (
            <IconButton aria-label="view store" onClick={() => navigate('/store')} sx={{ bgcolor: '#fff', border: `1px solid ${brand.line}` }}><Store size={19} /></IconButton>
          )}
          <IconButton aria-label="notifications" onClick={() => notify('You are all caught up!', 'info')} sx={{ bgcolor: '#fff', border: `1px solid ${brand.line}` }}><Bell size={19} /></IconButton>
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Avatar sx={{ bgcolor: brand.orange, width: 40, height: 40 }}>{user?.name?.[0] || 'U'}</Avatar>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{user?.name || 'User'}</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', textTransform: 'capitalize' }}>{user?.role || ''}</Typography>
            </Box>
          </Stack>
        </Stack>
        <Box sx={{ flexGrow: 1, minWidth: 0, width: '100%', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ maxWidth: 1400, mx: 'auto', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      <ConfirmDialog open={confirm} title="Log out?" message="You'll need to sign in again to access your dashboard." confirmText="Logout" onConfirm={doLogout} onClose={() => setConfirm(false)} />
    </Box>
  );
}
