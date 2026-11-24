import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Edit3, Save, X } from 'lucide-react';
import { useState } from 'react';
import Panel from '../../../components/common/Panel';
import { useAuth, useOrders, useToast } from '../../../hooks';
import ProfileSummaryCard from './ProfileSummaryCard';
import validateProfile, { type ProfileForm } from './validateProfile';

const BuyerProfile = () => {
  const { user, updateProfile } = useAuth();
  const { ordersFor } = useOrders();
  const { notify } = useToast();

  const init = (): ProfileForm => ({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    address: user?.address?.address ?? '', city: user?.address?.city ?? '', state: user?.address?.state ?? '', pincode: user?.address?.pincode ?? '',
  });

  const [edit, setEdit] = useState(false);
  const [f, setF] = useState<ProfileForm>(init);
  const [err, setErr] = useState<Record<string, string>>({});
  const orders = user ? ordersFor(user.id) : [];

  const save = () => {
    const er = validateProfile(f);
    setErr(er);
    if (Object.keys(er).length) return;
    updateProfile({ name: f.name.trim(), email: f.email, phone: f.phone, address: { address: f.address, city: f.city, state: f.state, pincode: f.pincode } });
    setEdit(false);
    notify('Profile updated successfully');
  };

  const cancel = () => {
    setF(init());
    setErr({});
    setEdit(false);
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '360px 1fr' }, gap: 3, width: '100%' }}>
      <ProfileSummaryCard
        name={user?.name}
        email={user?.email}
        orderCount={orders.length}
        totalSpent={orders.reduce((s, o) => s + o.total, 0)}
      />

      <Panel title="Profile information" action={edit ? (
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" startIcon={<X size={15} />} onClick={cancel}>Cancel</Button>
          <Button size="small" variant="contained" startIcon={<Save size={15} />} onClick={save} id="profile-save">Save</Button>
        </Stack>
      ) : <Button size="small" variant="contained" startIcon={<Edit3 size={15} />} onClick={() => setEdit(true)} id="profile-edit">Edit profile</Button>}>
        <Stack spacing={2.5}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField id="profile-name" fullWidth label="Full name" value={f.name} disabled={!edit} onChange={(e) => setF({ ...f, name: e.target.value })} error={!!err.name} helperText={err.name} />
            <TextField id="profile-phone" fullWidth label="Phone number" value={f.phone} disabled={!edit} onChange={(e) => setF({ ...f, phone: e.target.value })} error={!!err.phone} helperText={err.phone} inputProps={{ maxLength: 10 }} />
          </Box>
          <TextField id="profile-email" fullWidth label="Email address" value={f.email} disabled={!edit} onChange={(e) => setF({ ...f, email: e.target.value })} error={!!err.email} helperText={err.email} />

          <Typography fontWeight={600} sx={{ mt: 2 }}>Saved delivery address</Typography>
          <TextField id="profile-address" fullWidth label="Street Address" value={f.address} disabled={!edit} onChange={(e) => setF({ ...f, address: e.target.value })} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            <TextField id="profile-city" fullWidth label="City" value={f.city} disabled={!edit} onChange={(e) => setF({ ...f, city: e.target.value })} />
            <TextField id="profile-state" fullWidth label="State" value={f.state} disabled={!edit} onChange={(e) => setF({ ...f, state: e.target.value })} />
            <TextField id="profile-pincode" fullWidth label="Pincode" value={f.pincode} disabled={!edit} onChange={(e) => setF({ ...f, pincode: e.target.value })} error={!!err.pincode} helperText={err.pincode} inputProps={{ maxLength: 6 }} />
          </Box>
        </Stack>
      </Panel>
    </Box>
  );
};

export default BuyerProfile;
