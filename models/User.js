const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionStartDate: { type: Date, required: true },
  subscriptionEndDate: { type: Date, required: true },
  subscriptionStatus: { type: String, enum: ['Active', 'Expired'], default: 'Active' }
});

module.exports = mongoose.model('User', userSchema);
