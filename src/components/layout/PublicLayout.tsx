import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
