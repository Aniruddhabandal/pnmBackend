const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dayjs = require('dayjs');
const SECRET = 'your_jwt_secret';

module.exports = async function (req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    // Check and update subscription status
    const isExpired = dayjs().isAfter(dayjs(user.subscriptionEndDate));
    if (isExpired && user.subscriptionStatus !== 'Expired') {
      user.subscriptionStatus = 'Expired';
      await user.save();
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};