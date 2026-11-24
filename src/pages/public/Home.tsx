import { Avatar, Box, Button, Container, Grid, Rating, Stack, TextField, Typography } from '@mui/material';
import { ArrowRight, ArrowUpRight, BadgeCheck, HandHeart, Leaf, ShieldCheck, Sprout, Truck, Wheat } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { brand } from '../../theme/theme';
import { CATEGORIES } from '../../utils/format';
import { SectionTitle, SmartImage } from '../../components/common';
import { ProductGrid } from '../../components/products/ProductCard';
import { useProducts, useToast } from '../../hooks';

const testimonials = [
  { name: 'Meera Krishnan', city: 'Chennai', text: 'The jaggery laddus taste exactly like my grandmother’s. You can genuinely taste the difference of real ghee.', rating: 5 },
  { name: 'Rohit Bansal', city: 'Delhi', text: 'Lakadong turmeric is a revelation — the colour and aroma are unmatched. Packaging feels premium too.', rating: 5 },
  { name: 'Sneha Iyer', city: 'Pune', text: 'Ordered the Festive Hamper as a Diwali gift. Everyone asked where it was from. Delivery was super quick!', rating: 5 },
];

export default function Home() {
  const { products, loading } = useProducts();
  const navigate = useNavigate();
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const best = [...products].filter((p) => p.bestSeller).sort((a, b) => b.sold - a.sold).slice(0, 4);

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setEmailErr('Please enter a valid email address');
    setEmailErr('');
    setEmail('');
    notify('Welcome to the SHP family! Check your inbox for 10% off.');
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      {/* HERO */}
      <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: brand.cream }}>
        <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 6, md: 0 } }}>
          <Grid container alignItems="center" sx={{ minHeight: { md: 640 } }}>
            <Grid item xs={12} md={6} sx={{ pr: { md: 6 }, zIndex: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ display: 'inline-flex', px: 1.8, py: 0.8, borderRadius: 999, bgcolor: '#fff', border: `1px solid ${brand.line}`, mb: 3 }}>
                <Sprout size={15} color={brand.leaf} />
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: brand.green }}>Certified organic · Small batch</Typography>
              </Stack>
              <Typography variant="h1" sx={{ fontSize: { xs: 44, sm: 56, lg: 72 }, lineHeight: 1.04, color: brand.green }}>
                Organic goodness,<br />
                <Box component="span" sx={{ color: brand.leaf, fontStyle: 'italic' }}>delivered</Box>
                <Box component="span" sx={{ color: brand.orange }}>.</Box>
              </Typography>
              <Typography sx={{ mt: 3, fontSize: { xs: 16, md: 18 }, color: 'text.secondary', maxWidth: 500, lineHeight: 1.75 }}>
                Handcrafted sweets, crunchy savouries and stone-ground spices — made with farm-fresh ingredients, cold-pressed oils and zero preservatives.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4.5 }}>
                <Button id="hero-shop-now" size="large" variant="contained" endIcon={<ArrowRight size={18} />} onClick={() => navigate('/store')} sx={{ px: 4, py: 1.6 }}>Shop now</Button>
                <Button size="large" variant="outlined" onClick={() => navigate('/podi')} sx={{ px: 4, py: 1.6 }}>Explore Podi varieties</Button>
              </Stack>
              <Stack direction="row" spacing={{ xs: 3, md: 5 }} sx={{ mt: 6 }}>
                {[['25k+', 'Happy homes'], ['120+', 'Partner farms'], ['4.9★', 'Avg. rating']].map(([n, l]) => (
                  <Box key={l}>
                    <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: 28, fontWeight: 600, color: brand.green }}>{n}</Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{l}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: { xs: 5, md: 0 } }}>
              <Box sx={{ position: 'relative' }}>
                <SmartImage src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80" alt="Organic spices, sweets and snacks on a rustic table" sx={{ width: '100%', aspectRatio: '1 / 1', maxHeight: 580, borderRadius: { xs: 6, md: '280px 280px 32px 32px' }, boxShadow: '0 40px 80px rgba(25,77,53,.18)' }} />
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ position: 'absolute', bottom: 28, left: { xs: 16, md: -28 }, p: 2, pr: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,.92)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,.1)' }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: brand.green, color: '#fff', display: 'grid', placeItems: 'center' }}><Truck size={20} /></Box>
                  <Box>
                    <Typography fontWeight={700} fontSize={14.5}>Delivered in 48 hrs</Typography>
                    <Typography fontSize={12.5} color="text.secondary">Freshly packed to order</Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FRESHNESS */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Grid item xs={12} md={5}>
            <Typography variant="overline" sx={{ color: brand.leaf }}>Our promise</Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 48 }, color: brand.green, mt: 1 }}>Freshness you can trust.</Typography>
            <Typography sx={{ mt: 2.5, color: 'text.secondary', lineHeight: 1.8, fontSize: 16.5 }}>
              Every batch is made only after you order. We source directly from certified organic farmers, cook in small kitchens and ship within a day — so what reaches you is as fresh as homemade.
            </Typography>
            <Button component={Link} to="/contact" endIcon={<ArrowUpRight size={18} />} sx={{ mt: 3, color: brand.green, px: 0 }}>Learn about our sourcing</Button>
          </Grid>
          <Grid item xs={12} md={7}>
            <Grid container spacing={2.5}>
              {[
                { icon: Wheat, t: 'Farm-direct sourcing', d: 'Partnered with 120+ certified organic farms.' },
                { icon: Leaf, t: 'No preservatives', d: 'Zero additives, colours or palm oil — ever.' },
                { icon: HandHeart, t: 'Made in small batches', d: 'Traditional recipes, handcrafted with care.' },
                { icon: ShieldCheck, t: 'Lab-tested quality', d: 'Every lot tested for purity & pesticides.' },
              ].map(({ icon: Icon, t, d }) => (
                <Grid item xs={12} sm={6} key={t}>
                  <Box sx={{ p: 3, height: '100%', borderRadius: 5, border: `1px solid ${brand.line}`, bgcolor: '#fff', transition: 'all .3s', '&:hover': { borderColor: brand.leaf, transform: 'translateY(-4px)' } }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: brand.cream, color: brand.green, display: 'grid', placeItems: 'center', mb: 2 }}><Icon size={22} /></Box>
                    <Typography fontWeight={600} fontSize={17}>{t}</Typography>
                    <Typography color="text.secondary" fontSize={14.5} sx={{ mt: 0.5, lineHeight: 1.6 }}>{d}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* FEATURED */}
      <Box sx={{ bgcolor: '#fff', py: { xs: 8, md: 12 }, borderTop: `1px solid ${brand.line}`, borderBottom: `1px solid ${brand.line}` }}>
        <Container maxWidth="xl">
          <SectionTitle align="left" eyebrow="Handpicked" title="Featured products" subtitle="Seasonal favourites our customers can’t stop talking about."
            action={<Button variant="outlined" endIcon={<ArrowRight size={16} />} onClick={() => navigate('/search')}>View all</Button>} />
          <ProductGrid products={featured} loading={loading} />
        </Container>
      </Box>

      {/* CATEGORIES */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <SectionTitle eyebrow="Explore" title="Shop by category" subtitle="From festive sweets to everyday masalas — find your organic essentials." />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: 1.5, sm: 3 },
            width: '100%',
          }}
        >
          {CATEGORIES.map((c) => (
            <Box component={Link} to={c.path} id={`category-${c.key}`} key={c.key} sx={{ display: 'block', position: 'relative', borderRadius: { xs: 4, sm: 6 }, overflow: 'hidden', aspectRatio: '3 / 4', textDecoration: 'none',
              '&:hover img': { transform: 'scale(1.08)' }, '&:hover .cat-arrow': { bgcolor: brand.orange, transform: 'rotate(-45deg)' } }}>
              <SmartImage src={c.image} alt={c.label} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transition: 'transform .8s ease' }} />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(16,48,33,.85))' }} />
              <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ position: 'absolute', left: { xs: 14, sm: 24 }, right: { xs: 14, sm: 24 }, bottom: { xs: 14, sm: 24 }, color: '#fff' }}>
                <Box>
                  <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: { xs: 16, sm: 26 }, fontWeight: 600 }}>{c.label}</Typography>
                  <Typography sx={{ fontSize: { xs: 11, sm: 13.5 }, opacity: 0.85, display: { xs: 'none', sm: 'block' } }}>{c.blurb}</Typography>
                </Box>
                <Box className="cat-arrow" sx={{ width: { xs: 30, sm: 44 }, height: { xs: 30, sm: 44 }, flexShrink: 0, borderRadius: '50%', bgcolor: 'rgba(255,255,255,.2)', backdropFilter: 'blur(6px)', display: 'grid', placeItems: 'center', transition: 'all .3s' }}>
                  <ArrowRight size={15} />
                </Box>
              </Stack>
            </Box>
          ))}
        </Box>
      </Container>

      {/* BEST SELLERS */}
      <Box sx={{ bgcolor: brand.cream, py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <SectionTitle align="left" eyebrow="Most loved" title="Best sellers" subtitle="The products that keep our customers coming back."
            action={<Button variant="contained" endIcon={<ArrowRight size={16} />} onClick={() => navigate('/store')}>Shop bestsellers</Button>} />
          <ProductGrid products={best} loading={loading} />
        </Container>
      </Box>

      {/* WHY CHOOSE */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ borderRadius: 8, bgcolor: brand.green, color: '#fff', p: { xs: 4, md: 8 }, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', bgcolor: brand.leaf, opacity: .25, right: -120, top: -160, filter: 'blur(10px)' }} />
          <Grid container spacing={5} sx={{ position: 'relative' }}>
            <Grid item xs={12} md={4}>
              <Typography variant="overline" sx={{ color: brand.orange }}>Why SHP Organics</Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 44 }, mt: 1 }}>Good for you. Good for the earth.</Typography>
              <Typography sx={{ mt: 2, opacity: .8, lineHeight: 1.8 }}>We believe the best food is honest food — grown responsibly and made with love.</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={3} justifyContent="center">
                {[
                  { icon: BadgeCheck, t: '100% Certified Organic', d: 'NPOP & India Organic certified ingredients.' },
                  { icon: Sprout, t: 'Fair to farmers', d: 'We pay 20% above market to our farming partners.' },
                  { icon: Truck, t: 'Fast, careful delivery', d: 'Eco-friendly packaging, delivered in 48 hours.' },
                  { icon: ShieldCheck, t: 'Freshness guarantee', d: 'Not happy? We’ll replace it — no questions.' },
                ].map(({ icon: Icon, t, d }) => (
                  <Grid item xs={12} sm={6} key={t}>
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ width: 48, height: 48, flexShrink: 0, borderRadius: 3, bgcolor: 'rgba(255,255,255,.1)', color: brand.orange, display: 'grid', placeItems: 'center' }}><Icon size={22} /></Box>
                      <Box>
                        <Typography fontWeight={600} fontSize={17}>{t}</Typography>
                        <Typography sx={{ opacity: .75, fontSize: 14.5, mt: .5, lineHeight: 1.6 }}>{d}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* TESTIMONIALS */}
      <Container maxWidth="xl" sx={{ pb: { xs: 8, md: 12 } }}>
        <SectionTitle eyebrow="Testimonials" title="Loved by 25,000+ homes" />
        <Grid container spacing={3} justifyContent="center">
          {testimonials.map((t) => (
            <Grid item xs={12} md={4} key={t.name}>
              <Box sx={{ p: 4, height: '100%', borderRadius: 6, bgcolor: '#fff', border: `1px solid ${brand.line}`, display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: 60, lineHeight: .6, color: brand.orange, height: 30 }}>“</Typography>
                <Typography sx={{ fontSize: 16.5, lineHeight: 1.75, flexGrow: 1, mt: 1 }}>{t.text}</Typography>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
                  <Avatar sx={{ bgcolor: brand.cream, color: brand.green, fontWeight: 700 }}>{t.name[0]}</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={600}>{t.name}</Typography>
                    <Typography fontSize={13} color="text.secondary">{t.city}</Typography>
                  </Box>
                  <Rating value={t.rating} readOnly size="small" sx={{ color: brand.orange }} />
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* NEWSLETTER */}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Box sx={{ borderRadius: 8, bgcolor: brand.cream, p: { xs: 4, md: 7 }, textAlign: 'center', border: `1px solid ${brand.line}` }}>
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 40 }, color: brand.green }}>Get 10% off your first order</Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1.5, mb: 4 }}>Join our newsletter for seasonal launches, recipes and members-only offers.</Typography>
          <Stack component="form" onSubmit={subscribe} direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ maxWidth: 520, mx: 'auto' }}>
            <TextField id="newsletter-email" fullWidth placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} error={!!emailErr} helperText={emailErr}
              InputProps={{ sx: { borderRadius: 999, height: 52, px: 1 } }} />
            <Button id="newsletter-subscribe" type="submit" variant="contained" sx={{ px: 4, height: 52, whiteSpace: 'nowrap' }}>Subscribe</Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
