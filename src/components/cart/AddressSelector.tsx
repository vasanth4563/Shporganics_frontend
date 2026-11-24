import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Briefcase, Check, Home, MapPin, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { brand } from '../../theme/theme';
import type { AddressType, SavedAddress } from '../../types';
import { KEYS, load, save } from '../../utils/storage';
import { useAuth } from '../../hooks';

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Delhi',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

export interface AddressFormValues {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  type?: AddressType;
}

interface AddressSelectorProps {
  value: AddressFormValues;
  onChange: (v: AddressFormValues) => void;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

export default function AddressSelector({
  value,
  onChange,
  errors = {},
  onClearError,
}: AddressSelectorProps) {
  const { user, updateProfile } = useAuth();
  const storageKey = user ? `${KEYS.addresses}_${user.id}` : `${KEYS.addresses}_guest`;

  // Load saved addresses from localStorage
  const [savedList, setSavedList] = useState<SavedAddress[]>(() => {
    const list = load<SavedAddress[]>(storageKey, []).filter(
      (a) => !a.address?.includes('Flat 402, Green Meadows')
    );
    if (list.length > 0) return list;

    // If user has a valid address on profile (not the old demo address), seed it as 'Home'
    if (user?.address?.address && !user.address.address.includes('Flat 402, Green Meadows')) {
      const defaultAddr: SavedAddress = {
        id: 'addr-default',
        type: 'Home',
        name: user.name || 'My Address',
        phone: user.phone || '',
        address: user.address.address,
        city: user.address.city || '',
        state: user.address.state || 'Tamil Nadu',
        pincode: user.address.pincode || '',
        isDefault: true,
      };
      save(storageKey, [defaultAddr]);
      return [defaultAddr];
    }
    return [];
  });

  const [selectedId, setSelectedId] = useState<string>(() => {
    return savedList.length > 0 ? savedList[0].id : 'manual';
  });

  const [isManualMode, setIsManualMode] = useState<boolean>(() => {
    // If no saved addresses exist, start directly in manual mode
    return savedList.length === 0;
  });

  // When saved address is selected, propagate to parent
  const handleSelectAddress = (id: string) => {
    setSelectedId(id);
    if (id === 'manual') {
      setIsManualMode(true);
      return;
    }
    const found = savedList.find((a) => a.id === id);
    if (found) {
      setIsManualMode(false);
      onChange({
        name: found.name || value.name || user?.name || '',
        phone: found.phone || value.phone || user?.phone || '',
        address: found.address,
        city: found.city,
        state: found.state,
        pincode: found.pincode,
        type: found.type || 'Home',
      });
    }
  };

  // Save new manual address to address options
  const handleSaveAsOption = () => {
    if (!value.address.trim()) return;

    const newOption: SavedAddress = {
      id: `addr-${Date.now()}`,
      type: value.type || 'Home',
      name: value.name.trim() || user?.name || 'Customer',
      phone: value.phone.trim() || user?.phone || '',
      address: value.address.trim(),
      city: value.city.trim(),
      state: value.state.trim() || 'Tamil Nadu',
      pincode: value.pincode.trim(),
      isDefault: savedList.length === 0,
    };

    const nextList = [newOption, ...savedList];
    setSavedList(nextList);
    save(storageKey, nextList);
    setSelectedId(newOption.id);
    setIsManualMode(false);

    // Also sync to user profile if logged in
    if (user && updateProfile) {
      updateProfile({
        phone: newOption.phone,
        address: {
          address: newOption.address,
          city: newOption.city,
          state: newOption.state,
          pincode: newOption.pincode,
        },
      });
    }
  };

  const handleDeleteOption = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextList = savedList.filter((a) => a.id !== id);
    setSavedList(nextList);
    save(storageKey, nextList);
    if (selectedId === id) {
      if (nextList.length > 0) {
        handleSelectAddress(nextList[0].id);
      } else {
        setSelectedId('manual');
        setIsManualMode(true);
      }
    }
  };

  const handleFieldChange = (field: keyof AddressFormValues, val: any) => {
    onChange({ ...value, [field]: val });
    if (onClearError) onClearError(field);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* 1. Header with Mode Toggle / Options */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        sx={{ mb: 1.5 }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: '1 1 auto' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: brand.cream,
              color: brand.green,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <MapPin size={16} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontSize={{ xs: 14, sm: 15 }} fontWeight={700} color="#111827" noWrap>
              Delivery Address
            </Typography>
            <Typography fontSize={{ xs: 11, sm: 12 }} color="text.secondary" noWrap>
              {savedList.length > 0 ? 'Saved address or manual entry' : 'Enter shipping address'}
            </Typography>
          </Box>
        </Stack>

        {savedList.length > 0 && (
          <Button
            size="small"
            variant={isManualMode ? 'outlined' : 'text'}
            startIcon={isManualMode ? <Check size={13} /> : <Plus size={13} />}
            onClick={() => {
              if (isManualMode && selectedId !== 'manual') {
                setIsManualMode(false);
              } else {
                setIsManualMode(true);
                setSelectedId('manual');
              }
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 12,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              py: 0.4,
              px: 1.2,
              borderRadius: '20px',
              color: isManualMode ? brand.green : brand.leaf,
              borderColor: brand.green,
            }}
          >
            {isManualMode ? 'Saved Options' : '+ Add Address'}
          </Button>
        )}
      </Stack>

      {/* 2. Saved Address Options (Cards) */}
      {!isManualMode && savedList.length > 0 && (
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          <RadioGroup
            value={selectedId}
            onChange={(e) => handleSelectAddress(e.target.value)}
          >
            {savedList.map((addr) => {
              const isSelected = selectedId === addr.id;
              return (
                <Box
                  key={addr.id}
                  onClick={() => handleSelectAddress(addr.id)}
                  sx={{
                    p: 1.8,
                    borderRadius: '14px',
                    border: `1.5px solid ${isSelected ? brand.green : '#E5E7EB'}`,
                    bgcolor: isSelected ? '#F4F8F2' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: brand.green },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <FormControlLabel
                      value={addr.id}
                      control={<Radio size="small" sx={{ p: 0.5, color: isSelected ? brand.green : '#9CA3AF' }} />}
                      sx={{ m: 0, alignItems: 'flex-start' }}
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 0.4 }}>
                            <Typography fontSize={14} fontWeight={700} color="#111827">
                              {addr.name || user?.name || 'Recipient'}
                            </Typography>
                            {addr.type && (
                              <Chip
                                size="small"
                                icon={addr.type === 'Home' ? <Home size={12} /> : addr.type === 'Work' ? <Briefcase size={12} /> : undefined}
                                label={addr.type}
                                sx={{
                                  height: 20,
                                  fontSize: 11,
                                  fontWeight: 600,
                                  bgcolor: addr.type === 'Home' ? '#DCFCE7' : '#E0E7FF',
                                  color: addr.type === 'Home' ? '#15803D' : '#4338CA',
                                }}
                              />
                            )}
                            {addr.phone && (
                              <Typography fontSize={12.5} color="text.secondary">
                                · {addr.phone}
                              </Typography>
                            )}
                          </Stack>
                          <Typography fontSize={13} color="#4B5563" sx={{ lineHeight: 1.4 }}>
                            {addr.address}, {addr.city}, {addr.state} – <b>{addr.pincode}</b>
                          </Typography>
                        </Box>
                      }
                    />
                    <Button
                      size="small"
                      onClick={(e) => handleDeleteOption(addr.id, e)}
                      sx={{ minWidth: 0, p: 0.5, color: '#9CA3AF', '&:hover': { color: '#EF4444' } }}
                      aria-label="remove address"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </Stack>
                </Box>
              );
            })}
          </RadioGroup>

          {/* Quick Option to switch to manual entry */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<Plus size={15} />}
            onClick={() => {
              setIsManualMode(true);
              setSelectedId('manual');
            }}
            sx={{
              py: 1,
              borderRadius: '12px',
              borderStyle: 'dashed',
              borderColor: brand.leaf,
              color: brand.green,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { bgcolor: '#F4F8F2', borderColor: brand.green },
            }}
          >
            + Enter a New Delivery Address Manually
          </Button>
        </Stack>
      )}

      {/* 3. Manual Address Entry Form */}
      {isManualMode && (
        <Box
          sx={{
            p: 2,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: `1.5px solid ${brand.line}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <Typography fontSize={13.5} fontWeight={700} color={brand.green} sx={{ mb: 1.5 }}>
            Enter Address Manually
          </Typography>

          <Stack spacing={1.6}>
            {/* Name & Phone */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <TextField
                id="manual-addr-name"
                size="small"
                fullWidth
                label="Full Name"
                placeholder="e.g. Vasanthan A"
                value={value.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                id="manual-addr-phone"
                size="small"
                fullWidth
                label="Phone Number"
                placeholder="10-digit mobile number"
                value={value.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                error={!!errors.phone}
                helperText={errors.phone}
                inputProps={{ maxLength: 10 }}
              />
            </Box>

            {/* Street / Door / Flat / Locality */}
            <TextField
              id="manual-addr-street"
              size="small"
              fullWidth
              multiline
              rows={2}
              label="Flat, House no., Building, Street, Area"
              placeholder="e.g. Flat 402, Green Meadows, 12th Main Road, Indiranagar"
              value={value.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
            />

            {/* City, State, Pincode */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.2fr 1.2fr 1fr' }, gap: 1.5 }}>
              <TextField
                id="manual-addr-city"
                size="small"
                fullWidth
                label="City / Town"
                placeholder="e.g. Bengaluru / Chennai"
                value={value.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                error={!!errors.city}
                helperText={errors.city}
              />
              <TextField
                id="manual-addr-state"
                size="small"
                select
                fullWidth
                label="State"
                value={value.state || 'Tamil Nadu'}
                onChange={(e) => handleFieldChange('state', e.target.value)}
                error={!!errors.state}
                helperText={errors.state}
              >
                {INDIAN_STATES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="manual-addr-pincode"
                size="small"
                fullWidth
                label="Pincode"
                placeholder="6 digits"
                value={value.pincode}
                onChange={(e) => handleFieldChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                error={!!errors.pincode}
                helperText={errors.pincode}
                inputProps={{ maxLength: 6 }}
              />
            </Box>

            {/* Address Type Tag & Save Option */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={1.5}
              sx={{ pt: 0.5 }}
            >
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography fontSize={12} color="text.secondary" fontWeight={600}>
                  Tag as:
                </Typography>
                {(['Home', 'Work', 'Other'] as AddressType[]).map((t) => {
                  const isSelected = (value.type || 'Home') === t;
                  return (
                    <Chip
                      key={t}
                      label={t}
                      clickable
                      size="small"
                      onClick={() => handleFieldChange('type', t)}
                      sx={{
                        fontWeight: 600,
                        fontSize: 12,
                        bgcolor: isSelected ? brand.green : '#F3F4F6',
                        color: isSelected ? '#FFFFFF' : '#374151',
                        '&:hover': { bgcolor: isSelected ? brand.green : '#E5E7EB' },
                      }}
                    />
                  );
                })}
              </Stack>

              <Button
                size="small"
                variant="contained"
                onClick={handleSaveAsOption}
                disabled={!value.address.trim() || !value.city.trim() || !value.pincode.trim()}
                sx={{
                  bgcolor: brand.green,
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2,
                  py: 0.7,
                  '&:hover': { bgcolor: brand.leaf },
                }}
              >
                Save This Address
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
