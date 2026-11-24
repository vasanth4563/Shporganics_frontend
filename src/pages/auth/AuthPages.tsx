import { Alert, Box, Button, Grid, IconButton, InputAdornment, Link as MLink, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Eye, EyeOff, ShoppingBasket, Store } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../components/common/Logo';
import { SmartImage } from '../../components/common';
import { brand } from '../../theme/theme';
import { useAuth, useToast } from '../../hooks';
import { Url } from '../../services/api';
import type { Role } from '../../types';

function AuthShell({ title, subtitle, children, maxWidth = 440 }: { title: string; subtitle: string; children: ReactNode; maxWidth?: number }) {
  return (
    <Grid container sx={{ height: '100vh', maxHeight: '100vh', overflow: { xs: 'auto', md: 'hidden' }, bgcolor: '#FCFAF5' }}>
      <Grid item md={6} sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', p: { md: 2, lg: 2.5 }, height: '100%' }}>
        <Box sx={{ position: 'relative', height: '100%', borderRadius: 6, overflow: 'hidden' }}>
          <SmartImage src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80" alt="Organic produce" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(25,77,53,.15), rgba(16,48,33,.88))' }} />
          <Box sx={{ position: 'absolute', left: 40, right: 40, bottom: 40, color: '#fff' }}>
            <Typography variant="h2" sx={{ fontSize: { md: 36, lg: 44 }, lineHeight: 1.1 }}>Organic goodness,<br /><i>delivered.</i></Typography>
            <Typography sx={{ mt: 1.5, opacity: .85, maxWidth: 420, lineHeight: 1.6, fontSize: { md: 14, lg: 15 } }}>Join 25,000+ homes enjoying honest, small-batch food from family farms.</Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2.5, sm: 3.5, md: 3, lg: 4 }, height: '100%', overflowY: { xs: 'auto', md: 'hidden' } }}>
        <Box sx={{ width: '100%', maxWidth }}>
          <Logo size="sm" />
          <Typography variant="h3" sx={{ fontSize: { xs: 26, sm: 30, md: 32 }, color: brand.green, mt: { xs: 1.2, sm: 1.8 } }}>{title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: { xs: 1.5, sm: 2 }, fontSize: { xs: 13, sm: 14 } }}>{subtitle}</Typography>
          {children}
        </Box>
      </Grid>
    </Grid>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  size = 'small',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  size?: 'small' | 'medium';
}) {
  const [show, setShow] = useState(false);
  return (
    <TextField
      id={id}
      fullWidth
      size={size}
      label={label}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShow((s) => !s)} edge="end" size="small" aria-label={show ? 'hide password' : 'show password'}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export function Login() {
  const { syncUserSession } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Email and Password are required');
      return;
    }

    const params = new URLSearchParams();
    params.append('username', trimmedEmail);
    params.append('password', password);

    setLoading(true);
    try {
      const response = await axios.post(`${Url.login}`, params);

      if (response.data.access_token) {
        const role = response.data.role ?? 'buyer';
        const userId = response.data.user_id != null ? String(response.data.user_id) : '';

        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('role', role);
        localStorage.setItem('user_id', userId);

        const displayName = response.data.user?.name || trimmedEmail.split('@')[0] || 'User';

        syncUserSession({
          id: userId,
          name: displayName,
          email: response.data.user?.email || trimmedEmail,
          role,
        });

        notify(`Welcome back, ${displayName.split(' ')[0]}!`);

        navigate(role === 'seller' ? '/seller' : '/buyer');
      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      let errorMessage = '';

      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        errorMessage = detail
          .map((item: any) => item?.msg || String(item))
          .filter(Boolean)
          .join(', ');
      }

      setError(
        errorMessage ||
          err.response?.data?.message ||
          'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue your organic journey.">
      <Stack component="form" onSubmit={handleLogin} noValidate spacing={1.8}>
        {error && <Alert severity="error" sx={{ py: 0.4, px: 1.5, borderRadius: 2.5, fontSize: 13 }}>{error}</Alert>}
        <TextField
          id="login-email"
          size="small"
          fullWidth
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          id="login-password"
          size="small"
          label="Password"
          value={password}
          onChange={(v) => setPassword(v)}
        />
        <Button
          id="login-submit"
          type="submit"
          variant="contained"
          size="medium"
          disabled={loading}
          sx={{ py: 1.1, fontSize: 15, borderRadius: 2.5 }}
        >
          {loading ? 'Signing in…' : 'Login'}
        </Button>
        <Typography textAlign="center" color="text.secondary" fontSize={13.5}>
          New to SHP Organics? <MLink component={Link} to="/signup" fontWeight={600} color={brand.green}>Create an account</MLink>
        </Typography>
      </Stack>
    </AuthShell>
  );
}

export function Signup() {
  const { signup, syncUserSession } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirm: '', role: 'buyer' as Role });
  const [err, setErr] = useState<Record<string, string>>({});
  const [formErr, setFormErr] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = 'Full name is required';
    if (!f.email.trim()) er.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email';
    if (!f.phone.trim()) er.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(f.phone)) er.phone = 'Enter a valid 10-digit mobile number';
    if (!f.password) er.password = 'Password is required';
    else if (f.password.length < 6) er.password = 'Password must be at least 6 characters';
    if (!f.confirm) er.confirm = 'Please confirm your password';
    else if (f.confirm !== f.password) er.confirm = 'Passwords do not match';
    setErr(er);
    setFormErr('');
    if (Object.keys(er).length) return;

    setLoading(true);
    try {
      const payload = {
        name: f.name.trim(),
        email: f.email.trim().toLowerCase(),
        phone: f.phone.trim(),
        password: f.password,
        role: f.role,
      };

      const response = await axios.post(`${Url.register}`, payload);

      if (response.data.access_token) {
        const role = response.data.role ?? f.role;
        const userId = response.data.user_id != null ? String(response.data.user_id) : '';

        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('role', role);
        localStorage.setItem('user_id', userId);

        syncUserSession({
          id: userId,
          name: response.data.user?.name || f.name.trim(),
          email: response.data.user?.email || f.email.trim(),
          phone: f.phone.trim(),
          role,
        });

        notify(`Account created successfully! Welcome, ${f.name.trim().split(' ')[0]}!`);
        navigate(role === 'seller' ? '/seller' : '/buyer');
      } else {
        notify('Account created successfully! Please log in.');
        navigate('/login');
      }
    } catch (err: any) {
      // Fallback to local auth if backend is unreachable
      if (!err.response) {
        try {
          const res = await signup({ name: f.name.trim(), email: f.email, phone: f.phone, password: f.password, role: f.role });
          if (!res.ok) {
            setFormErr(res.error ?? 'Something went wrong');
            return;
          }
          notify('Account created successfully! Please log in.');
          navigate('/login');
          return;
        } catch {
          // ignore
        }
      }

      const detail = err.response?.data?.detail;
      let errorMessage = '';

      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        errorMessage = detail
          .map((item: any) => item?.msg || String(item))
          .filter(Boolean)
          .join(', ');
      }

      setFormErr(
        errorMessage ||
          err.response?.data?.message ||
          'Failed to create account. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start shopping fresh, or set up your seller dashboard." maxWidth={490}>
      <Stack component="form" onSubmit={submit} noValidate spacing={1.3}>
        {formErr && <Alert severity="error" sx={{ py: 0.4, px: 1.5, borderRadius: 2.5, fontSize: 13 }}>{formErr}</Alert>}
        <Box>
          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={f.role}
            onChange={(_, v) => v && set('role')(v)}
            sx={{
              '& .MuiToggleButton-root': {
                py: 0.7,
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 13.5,
                gap: 1,
                '&.Mui-selected': { bgcolor: brand.green, color: '#fff', '&:hover': { bgcolor: brand.green } },
              },
            }}
          >
            <ToggleButton value="buyer" id="role-buyer">
              <ShoppingBasket size={16} /> Buyer Account
            </ToggleButton>
            <ToggleButton value="seller" id="role-seller">
              <Store size={16} /> Seller Account
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TextField
          id="signup-name"
          size="small"
          fullWidth
          label="Full name"
          value={f.name}
          onChange={(e) => set('name')(e.target.value)}
          error={!!err.name}
          helperText={err.name}
        />

        <Grid container spacing={1.2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="signup-email"
              size="small"
              fullWidth
              label="Email address"
              value={f.email}
              onChange={(e) => set('email')(e.target.value)}
              error={!!err.email}
              helperText={err.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="signup-phone"
              size="small"
              fullWidth
              label="Phone number"
              value={f.phone}
              onChange={(e) => set('phone')(e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={!!err.phone}
              helperText={err.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0.5 }}>
                    <Typography fontSize={13} color="text.secondary">+91</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={1.2}>
          <Grid item xs={12} sm={6}>
            <PasswordField
              id="signup-password"
              size="small"
              label="Password"
              value={f.password}
              onChange={set('password')}
              error={err.password}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PasswordField
              id="signup-confirm"
              size="small"
              label="Confirm password"
              value={f.confirm}
              onChange={set('confirm')}
              error={err.confirm}
            />
          </Grid>
        </Grid>

        <Button
          id="signup-submit"
          type="submit"
          variant="contained"
          size="medium"
          disabled={loading}
          sx={{ py: 1.05, fontSize: 15, borderRadius: 2.5, mt: 0.4 }}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </Button>

        <Typography textAlign="center" color="text.secondary" fontSize={13.5} sx={{ mt: 0.4 }}>
          Already have an account?{' '}
          <MLink component={Link} to="/login" fontWeight={600} color={brand.green}>
            Login
          </MLink>
        </Typography>
      </Stack>
    </AuthShell>
  );
}
