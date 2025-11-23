const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const Coupon = require('./models/coupon');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => {
    console.error('MongoDB error:', err);
    process.exit(1);
  });

let users = [
  { username: 'admin', email: 'admin@admin.com', password: 'admin123', role: 'admin' }
];
let purchases = [];

// AUTH routes
app.post('/api/signup', (req, res) => {
  const { username, email, password, role } = req.body;
  users.push({ username, email, password, role: role || 'user' });
  res.json({ message: 'Signup successful', user: { username, email, role: role || 'user' } });
});
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  const user = users.find(u => u.email === email && u.password === password && u.role === role);
  if (user) {
    res.json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/categories', (req, res) => {
  res.json(['Electronics', 'Groceries', 'Fashion', 'Sports']);
});
app.get('/api/admin-dashboard', (req, res) => {
  res.json({ dashboard: 'Admin dashboard data' });
});

// COUPON CRUD
app.post('/api/coupons', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), async (req, res) => {
  try {
    const { title, price, discount, expiry, code, description, addedBy } = req.body;
    const thumbnailPath = req.files['thumbnail']
      ? '/uploads/' + req.files['thumbnail'][0].filename
      : '';
    const images = req.files['images']
      ? req.files['images'].map(f => '/uploads/' + f.filename)
      : [];
    const coupon = new Coupon({
      title,
      price: Number(price),
      discount: Number(discount),
      expiry,
      code,
      description,
      addedBy,
      thumbnail: thumbnailPath,
      images
    });
    await coupon.save();
    res.json({ success: true, coupon });
  } catch (err) {
    console.error("Coupon add error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/coupons', async (req, res) => {
  const { addedBy } = req.query;
  let coupons = [];
  if (addedBy) {
    coupons = await Coupon.find({ addedBy }).sort({ _id: -1 });
  } else {
    coupons = await Coupon.find().sort({ _id: -1 });
  }
  res.json(coupons);
});
app.get('/api/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    res.json(coupon);
  } catch (err) {
    res.status(404).json({ error: 'Coupon not found' });
  }
});
app.delete('/api/coupons/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

// STRIPE PAYMENT INTENT
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,     // INR = paise, USD = cents
      currency: 'inr',
      automatic_payment_methods: { enabled: true }
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).send({ error: err.message });
  }
});

// USER PURCHASE
app.post('/api/user-purchased', (req, res) => {
  const { user, couponId } = req.body;
  purchases.push({ user, couponId });
  res.json({ success: true });
});
app.get('/api/user-purchased', async (req, res) => {
  const { user } = req.query;
  const ids = purchases.filter(p => p.user === user).map(p => p.couponId);
  let coupons = [];
  if (ids.length)
    coupons = await Coupon.find({ _id: { $in: ids } });
  res.json(coupons);
});
app.get('/api/user-visited', (req, res) => {
  const { user } = req.query;
  res.json([]);
});

app.get('/', (req, res) => {
  res.send('VoucherHub backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
