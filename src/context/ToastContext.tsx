import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Alert, Slide, Snackbar, type AlertColor } from '@mui/material';

interface ToastCtx {
  notify: (message: string, severity?: AlertColor) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; message: string; severity: AlertColor; key: number }>({
    open: false, message: '', severity: 'success', key: 0,
  });

  const notify = useCallback((message: string, severity: AlertColor = 'success') => {
    setState({ open: true, message, severity, key: Date.now() });
  }, []);

  return (
    <Ctx.Provider value={{ notify }}>
      {children}
      <Snackbar
        key={state.key}
        open={state.open}
        autoHideDuration={2800}
        onClose={() => setState((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert
          variant="filled"
          severity={state.severity}
          onClose={() => setState((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 3, fontWeight: 500, boxShadow: '0 12px 30px rgba(0,0,0,.15)', ...(state.severity === 'success' && { bgcolor: 'primary.main' }) }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </Ctx.Provider>
  );
}

export const useToast = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useToast must be inside ToastProvider');
  return c;
};
