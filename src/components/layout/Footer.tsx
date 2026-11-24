import { Box, Container, Grid, IconButton, Stack, Typography } from '@mui/material';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { brand } from '../../theme/theme';

const cols = [
  { title: 'Shop', links: [['Podi Varieties', '/podi'], ['Snacks', '/snacks'], ['Sweets', '/sweets'], ['Additional Snacks', '/additional-snacks']] },
  { title: 'Account', links: [['Login', '/login'], ['Sign Up', '/signup'], ['My Cart', '/cart'], ['Track Order', '/buyer/track']] },
  { title: 'Company', links: [['Home', '/'], ['Contact Us', '/contact'], ['Search', '/search']] },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: brand.green, color: 'rgba(255,255,255,.78)', pt: { xs: 8, md: 10 }, pb: 4, mt: 'auto' }}>
      <Container maxWidth="xl">
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Logo light />
            <Typography sx={{ mt: 2.5, maxWidth: 340, lineHeight: 1.8, fontSize: 14.5 }}>
              SHP ORGANICS (Associated with SHP Events). Authentic homemade Podi varieties, traditional sweets, and crispy snacks crafted the time-tested way.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              {([[Instagram, 'https://instagram.com'], [Facebook, 'https://facebook.com'], [Twitter, 'https://x.com'], [Youtube, 'https://youtube.com']] as const).map(([Icon, href]) => (
                <IconButton key={href} component="a" href={href} target="_blank" rel="noopener noreferrer" aria-label="social link"
                  sx={{ color: brand.cream, border: '1px solid rgba(255,255,255,.18)', transition: 'all .2s', '&:hover': { bgcolor: brand.orange, borderColor: brand.orange } }}>
                  <Icon size={17} />
                </IconButton>
              ))}
            </Stack>
          </Grid>
          {cols.map((c) => (
            <Grid item xs={6} md={2} key={c.title}>
              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>{c.title}</Typography>
              <Stack spacing={1.3}>
                {c.links.map(([l, to]) => (
                  <Box key={l} component={Link} to={to} sx={{ color: 'inherit', textDecoration: 'none', fontSize: 14.5, '&:hover': { color: brand.orange } }}>{l}</Box>
                ))}
              </Stack>
            </Grid>
          ))}
          <Grid item xs={12} md={2}>
            <Typography sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>Get in touch</Typography>
            <Stack spacing={1.5} sx={{ fontSize: 14.5 }}>
              <Stack direction="row" spacing={1.2}><MapPin size={17} style={{ flexShrink: 0, marginTop: 2 }} /><span>14, Green Valley Road, Coimbatore, TN 641001</span></Stack>
              <Stack direction="row" spacing={1.2}><Phone size={17} /><span>+91 9003219694</span></Stack>
              <Stack direction="row" spacing={1.2}><Mail size={17} /><span>hello@shporganics.in</span></Stack>
            </Stack>
          </Grid>
        </Grid>
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,.12)', mt: 7, pt: 3, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between', fontSize: 13 }}>
          <span>© {new Date().getFullYear()} SHP Organics. All rights reserved.</span>
          <span>Organic goodness, delivered.</span>
        </Box>
      </Container>
    </Box>
  );
}
