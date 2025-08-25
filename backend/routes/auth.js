const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = process.env.JWT_SECRET || 'secret_placeholder';

// Signup (normal user)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, address, password } = req.body;
    if(!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ message: 'Email already in use' });
    // basic server-side validation (more can be added)
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, address, password: hashed, role: 'user' });
    await user.save();
    return res.json({ message: 'User created' });
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Login (all roles)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Change password
const auth = require('../middleware/auth');
router.post('/change-password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const bcrypt = require('bcryptjs');
    const user = await User.findById(req.user._id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if(!ok) return res.status(400).json({ message: 'Old password incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated' });
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
