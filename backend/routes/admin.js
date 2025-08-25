const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// all admin routes require auth + admin role
router.use(auth, role('admin'));

router.post('/add-user', async (req, res) => {
  try {
    const { name, email, address, password, role: r } = req.body;
    if(!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ message: 'Email exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, address, password: hashed, role: r || 'user' });
    await user.save();
    res.json({ message: 'User created', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.get('/dashboard-stats', async (req, res) => {
  try {
    const users = await User.countDocuments();
    const stores = await Store.countDocuments();
    const ratings = await Rating.countDocuments();
    res.json({ users, stores, ratings });
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.get('/users', async (req, res) => {
  const { q, role } = req.query;
  const filter = {};
  if(role) filter.role = role;
  if(q) filter.$or = [{ name: new RegExp(q,'i') }, { email: new RegExp(q,'i') }, { address: new RegExp(q,'i') }];
  const list = await User.find(filter).select('-password').lean();
  res.json(list);
});

router.get('/stores', async (req, res) => {
  const { q } = req.query;
  const filter = {};
  if(q) filter.$or = [{ name: new RegExp(q,'i') }, { email: new RegExp(q,'i') }, { address: new RegExp(q,'i') }];
  const stores = await Store.find(filter).lean();
  // attach avg rating
  const result = await Promise.all(stores.map(async s => {
    const agg = await Rating.aggregate([ { $match: { store: s._id } }, { $group: { _id:'$store', avg:{ $avg: '$score' } } } ]);
    s.avgRating = agg[0]?.avg ? Number(agg[0].avg.toFixed(2)) : null;
    return s;
  }));
  res.json(result);
});

router.get('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if(!user) return res.status(404).json({ message: 'Not found' });
  // if owner, attach rating (average of their stores)
  if(user.role === 'owner') {
    const stores = await Store.find({ owner: user._id });
    const storeIds = stores.map(s => s._id);
    const agg = await Rating.aggregate([ { $match: { store: { $in: storeIds } } }, { $group: { _id: null, avg: { $avg: '$score' } } } ]);
    user.avgRating = agg[0]?.avg ? Number(agg[0].avg.toFixed(2)) : null;
  }
  res.json(user);
});

module.exports = router;
