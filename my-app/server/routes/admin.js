const express = require('express');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Lazy load User model
const getUser = () => require('../models/User');

// GET /api/admin/users - list all users (admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const User = getUser();
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err) {
    console.error('Failed to fetch users', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Admin: Update a service by id
router.put('/services/:id', adminAuth, async (req, res) => {
  try {
    // Lazy-load Service model
    const Service = require('../models/Service');
    const id = String(req.params.id);
    const payload = req.body || {};

    // Build update object - allow updating common fields only
    const update = {};
    const allowed = ['servicename', 'description', 'city', 'cuisinetype', 'rating', 'pricing', 'deliveryTimes', 'menu', 'contact'];
    allowed.forEach(k => {
      if (payload[k] !== undefined) update[k] = payload[k];
    });

    const doc = await Service.findOneAndUpdate({ id }, { $set: update }, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Service not found' });

    res.json({ success: true, service: doc });
  } catch (err) {
    console.error('Failed to update service', err);
    res.status(500).json({ message: 'Failed to update service' });
  }
});

module.exports = router;
