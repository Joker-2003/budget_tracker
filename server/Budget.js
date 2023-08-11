const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
