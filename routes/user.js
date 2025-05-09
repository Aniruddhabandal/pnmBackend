const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/me', authMiddleware, (req, res) => {
  const { email, subscriptionStartDate, subscriptionEndDate, subscriptionStatus } = req.user;
  res.json({ email, subscriptionStartDate, subscriptionEndDate, subscriptionStatus });
});

router.get('/service', authMiddleware, (req, res) => {
  if (req.user.subscriptionStatus !== 'Active') {
    return res.status(403).json({ message: 'Subscription expired. Please renew.' });
  }
  res.json({ message: 'Welcome to the service!' });
});

module.exports = router;