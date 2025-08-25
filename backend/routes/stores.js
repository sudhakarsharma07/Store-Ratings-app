const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Add store (admin only)
router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = new Store({ name, email, address, owner: ownerId });
    await store.save();
    res.json({ message: 'Store added', store });
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// List stores (with average rating and optionally search)
router.get('/', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const filter = {};
    if(q){
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { address: new RegExp(q, 'i') }
      ];
    }
    const stores = await Store.find(filter).lean();
    // attach avg rating and user's rating if user provided token
    const result = await Promise.all(stores.map( async s => {
      const agg = await Rating.aggregate([
        { $match: { store: s._id } },
        { $group: { _id: '$store', avg: { $avg: '$score' }, count: { $sum: 1 } } }
      ]);
      s.avgRating = agg[0]?.avg ? Number(agg[0].avg.toFixed(2)) : null;
      s.ratingCount = agg[0]?.count || 0;
      // find current user's rating
      s.userRating = null;
      if(req.user){
        const ur = await Rating.findOne({ store: s._id, user: req.user._id });
        if(ur) s.userRating = ur.score;
      }
      return s;
    }));
    res.json(result);
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Get store details
router.get('/:id', auth, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if(!store) return res.status(404).json({ message: 'Not found' });
    const agg = await Rating.aggregate([ { $match: { store: store._id } }, { $group: {_id: '$store', avg:{ $avg: '$score'}, count:{ $sum:1 } } } ]);
    const avg = agg[0]?.avg ? Number(agg[0].avg.toFixed(2)) : null;
    res.json({ store, avgRating: avg });
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
