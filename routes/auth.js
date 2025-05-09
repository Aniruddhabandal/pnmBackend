const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const User = require('../models/User');
const router = express.Router();

const SECRET = 'your_jwt_secret';

router.post('/register', async (req, res) => {
  const { email, password, subscriptionStartDate, subscriptionDuration } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const startDate = new Date(subscriptionStartDate);
  const endDate = subscriptionDuration === 'monthly'
    ? dayjs(startDate).add(1, 'month').toDate()
    : dayjs(startDate).add(1, 'year').toDate();

  const status = dayjs().isBefore(endDate) ? 'Active' : 'Expired';

  try {
    const user = new User({
      email,
      password: hashedPassword,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
      subscriptionStatus: status
    });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;