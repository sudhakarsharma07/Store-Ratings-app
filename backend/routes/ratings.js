const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const auth = require('../middleware/auth');

// submit or update rating (user)
router.post('/:storeId', auth, async (req, res) => {
  try {
    const { score } = req.body;
    const storeId = req.params.storeId;
    if(!score || score <1 || score>5) return res.status(400).json({ message: 'Score must be 1-5' });
    let rating = await Rating.findOne({ user: req.user._id, store: storeId });
    if(rating){
      rating.score = score;
      await rating.save();
      return res.json({ message: 'Rating updated', rating });
    } else {
      rating = new Rating({ user: req.user._id, store: storeId, score });
      await rating.save();
      return res.json({ message: 'Rating created', rating });
    }
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// list ratings for a store (owner/admin)
router.get('/store/:storeId', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ store: req.params.storeId }).populate('user','name email address');
    res.json(ratings);
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
