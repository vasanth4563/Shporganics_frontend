import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { bootstrapStorage } from './services/mockServices';
import AppRoutes from './routes/AppRoutes';
import QuickCheckoutDialog from './components/cart/QuickCheckoutDialog';

export default function App() {
  useEffect(() => {
    // Seed initial mock data if localStorage is empty
    bootstrapStorage();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
                <BrowserRouter>
                  <AppRoutes />
                  <QuickCheckoutDialog />
                </BrowserRouter>
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
