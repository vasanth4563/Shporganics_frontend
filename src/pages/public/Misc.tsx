import { Box, Button, Container, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { brand } from '../../theme/theme';
import { useToast } from '../../hooks';

export function Contact() {
  const { notify } = useToast();
  const [f, setF] = useState({ name: '', email: '', topic: 'General enquiry', message: '' });
  const [err, setErr] = useState<Record<string, string>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email';
    if (f.message.trim().length < 10) er.message = 'Message should be at least 10 characters';
    setErr(er);
    if (Object.keys(er).length) return;
    notify('Thanks! Our team will get back to you within 24 hours.');
    setF({ name: '', email: '', topic: 'General enquiry', message: '' });
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
      <Grid container spacing={{ xs: 5, md: 8 }}>
        <Grid item xs={12} md={5}>
          <Typography variant="overline" sx={{ color: brand.leaf }}>Contact us</Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: 40, md: 56 }, color: brand.green, mt: 1 }}>We’d love to hear from you.</Typography>
          <Typography sx={{ color: 'text.secondary', mt: 2, lineHeight: 1.8 }}>
            SHP ORGANICS · Associated Brand: SHP Events.<br />
            Questions about an order, bulk gifting or our traditional delicacies? Drop us a note or call us directly.
          </Typography>
          <Stack spacing={2.5} sx={{ mt: 5 }}>
            {[
              { icon: MapPin, t: 'Visit', d: '14, Green Valley Road, Coimbatore, Tamil Nadu 641001' },
              { icon: Phone, t: 'Call', d: '+91 9003219694' },
              { icon: Mail, t: 'Email', d: 'hello@shporganics.in' },
              { icon: Clock, t: 'Hours', d: 'Mon – Sat, 9:00 AM – 7:00 PM' },
            ].map(({ icon: Icon, t, d }) => (
              <Stack direction="row" spacing={2} key={t}>
                <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: brand.cream, color: brand.green, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon size={20} /></Box>
                <Box><Typography fontWeight={600}>{t}</Typography><Typography color="text.secondary" fontSize={14.5}>{d}</Typography></Box>
              </Stack>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={7}>
          <Box component="form" onSubmit={submit} noValidate sx={{ p: { xs: 3, md: 5 }, borderRadius: 6, bgcolor: '#fff', border: `1px solid ${brand.line}` }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}><TextField id="contact-name" fullWidth label="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={!!err.name} helperText={err.name} /></Grid>
              <Grid item xs={12} sm={6}><TextField id="contact-email" fullWidth label="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={!!err.email} helperText={err.email} /></Grid>
              <Grid item xs={12}>
                <TextField id="contact-topic" select fullWidth label="Topic" value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })}>
                  {['General enquiry', 'Order support', 'Bulk / corporate gifting', 'Become a partner farm'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}><TextField id="contact-message" fullWidth multiline rows={5} label="Message" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} error={!!err.message} helperText={err.message} /></Grid>
              <Grid item xs={12}><Button id="contact-submit" type="submit" variant="contained" size="large" endIcon={<Send size={17} />}>Send message</Button></Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export function NotFound() {
  return (
    <Container sx={{ py: 14, textAlign: 'center' }}>
      <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: 120, color: brand.cream, fontWeight: 700, lineHeight: 1, WebkitTextStroke: `2px ${brand.leaf}` }}>404</Typography>
      <Typography variant="h4" sx={{ color: brand.green, mt: 2 }}>This page wandered off the farm.</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>The page you’re looking for doesn’t exist.</Typography>
      <Button component={Link} to="/" variant="contained">Back to home</Button>
    </Container>
  );
}
