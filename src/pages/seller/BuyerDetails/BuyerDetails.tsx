import {
  Avatar,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { brand } from '../../../theme/theme';
import { formatDate, formatPrice } from '../../../utils/format';
import { useAuth, useOrders } from '../../../hooks';
import SellerPanel from '../shared/SellerPanel';
import { sellerService, type RegisteredBuyer } from '../../../services/sellerService';

/* =========================================================================
   5. BUYER DETAILS
   ========================================================================= */
const BuyerDetails = () => {
  const { allUsers } = useAuth();
  const { orders } = useOrders();
  const [apiBuyers, setApiBuyers] = useState<RegisteredBuyer[] | null>(null);

  useEffect(() => {
    let active = true;
    sellerService.getRegisteredBuyers().then((res) => {
      if (active && res?.buyers) {
        setApiBuyers(res.buyers);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const localBuyers = useMemo(() => {
    return allUsers().filter((u) => u.role === 'buyer');
  }, [allUsers]);

  // Merge backend registered buyers, local registered buyers, and ordering buyers
  const buyersList = useMemo(() => {
    const map = new Map<string, any>();

    // 1. First add local registered buyers
    localBuyers.forEach((u) => {
      const key = (u.email || u.id || '').toLowerCase();
      if (key) map.set(key, { ...u });
    });

    // 2. Merge with apiBuyers if loaded
    if (apiBuyers && apiBuyers.length > 0) {
      apiBuyers.forEach((ab) => {
        const key = (ab.email || String(ab.id) || '').toLowerCase();
        const existing = map.get(key) || {};
        if (key) map.set(key, { ...existing, ...ab });
      });
    }

    // 3. Include any buyers who placed orders
    orders.forEach((o) => {
      const key = (o.email || o.phone || o.buyerName || '').trim().toLowerCase();
      if (key && !map.has(key)) {
        // Also check if matches any existing by phone or email
        let found = false;
        for (const existing of map.values()) {
          const matchE = o.email && existing.email && o.email.trim().toLowerCase() === existing.email.trim().toLowerCase();
          const matchP = o.phone && existing.phone && o.phone.replace(/\D/g, '') === String(existing.phone).replace(/\D/g, '');
          if (matchE || matchP) {
            found = true;
            break;
          }
        }
        if (!found) {
          const s = o.shipping;
          const addrStr = s?.address ? [s.address, s.city, s.state, s.pincode].filter(Boolean).join(', ') : '';
          map.set(key, {
            id: o.buyerId || `order-${o.id}`,
            name: o.buyerName,
            email: o.email || '—',
            phone: o.phone || '—',
            role: 'buyer',
            address: addrStr,
          });
        }
      }
    });

    return Array.from(map.values());
  }, [localBuyers, apiBuyers, orders]);

  // Robust order matching for a buyer by ID, email, phone, or name
  const getOrdersForBuyer = (b: any) => {
    return orders.filter((o) => {
      const bId = String(b.id || '');
      const oBuyerId = String(o.buyerId || '');
      const matchId = Boolean(bId && oBuyerId && bId === oBuyerId);
      const bEmail = (b.email || '').trim().toLowerCase();
      const oEmail = (o.email || '').trim().toLowerCase();
      const matchEmail = Boolean(bEmail && oEmail && bEmail === oEmail && bEmail !== '—');
      const cleanBPhone = String(b.phone || '').replace(/\D/g, '');
      const cleanOPhone = String(o.phone || '').replace(/\D/g, '');
      const matchPhone = Boolean(cleanBPhone && cleanOPhone && cleanBPhone.length >= 7 && cleanBPhone === cleanOPhone);
      const cleanBName = String(b.name || '').trim().toLowerCase();
      const cleanOName = String(o.buyerName || '').trim().toLowerCase();
      const matchName = Boolean(
        cleanBName &&
        cleanOName &&
        (cleanBName === cleanOName ||
         (cleanBName.length >= 3 && cleanOName.includes(cleanBName)) ||
         (cleanOName.length >= 3 && cleanBName.includes(cleanOName)))
      );

      return matchId || matchEmail || matchPhone || matchName;
    });
  };

  return (
    <SellerPanel
      title="Registered Buyers"
      subtitle="Customer directory with lifetime order activity"
    >
      <TableContainer sx={{ width: '100%', minWidth: 0, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Buyer Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Delivery Address</TableCell>
              <TableCell>Total Orders</TableCell>
              <TableCell>Recent Purchase</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buyersList.map((b) => {
              const matchedOrders = getOrdersForBuyer(b);
              const totalOrdersCount = Math.max(matchedOrders.length, b.totalOrders || 0);
              const latestOrder = matchedOrders[0];

              // Derive delivery address from matched order shipping or user saved address
              let deliveryAddress = 'No saved address';
              if (latestOrder?.shipping?.address) {
                const s = latestOrder.shipping;
                deliveryAddress = [s.address, s.city, s.state, s.pincode].filter(Boolean).join(', ');
              } else if (b.address) {
                if (typeof b.address === 'string' && b.address !== 'No saved address') {
                  deliveryAddress = b.address;
                } else if (typeof b.address === 'object' && b.address.address) {
                  const s = b.address;
                  deliveryAddress = [s.address, s.city, s.state, s.pincode].filter(Boolean).join(', ');
                }
              }

              // Derive recent purchase
              const recentPurchase = latestOrder
                ? {
                    id: latestOrder.id,
                    date: latestOrder.createdAt,
                    total: latestOrder.total,
                  }
                : b.recentPurchase;

              return (
                <TableRow key={b.id || b.email} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: brand.green, width: 34, height: 34, fontSize: 14 }}>
                        {b.name?.[0]?.toUpperCase() || 'U'}
                      </Avatar>
                      <Typography fontWeight={600} fontSize={14}>
                        {b.name || 'Unnamed Buyer'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{b.email || '—'}</TableCell>
                  <TableCell>{b.phone || latestOrder?.phone || '—'}</TableCell>
                  <TableCell sx={{ maxWidth: 260 }}>
                    <Typography fontSize={13} color={deliveryAddress === 'No saved address' ? 'text.secondary' : 'text.primary'}>
                      {deliveryAddress}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: totalOrdersCount > 0 ? brand.green : 'text.secondary' }}>
                    {totalOrdersCount} {totalOrdersCount === 1 ? 'order' : 'orders'}
                  </TableCell>
                  <TableCell>
                    {recentPurchase ? (
                      <Box>
                        <Typography fontSize={13} fontWeight={600} color={brand.green}>
                          {recentPurchase.id}
                        </Typography>
                        <Typography fontSize={12} color="text.secondary">
                          {formatDate(recentPurchase.date)} ({formatPrice(recentPurchase.total)})
                        </Typography>
                      </Box>
                    ) : (
                      <Typography fontSize={12} color="text.secondary">
                        No orders yet
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </SellerPanel>
  );
};

export default BuyerDetails;
