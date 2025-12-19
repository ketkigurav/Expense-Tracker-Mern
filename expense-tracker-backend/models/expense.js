const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'Uncategorized'
  },
  // --- ADD THIS FIELD ---
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Stores the MongoDB ID of the user
    ref: 'User', // References the 'User' model
    required: true // Every expense must belong to a user
  }
});

module.exports = mongoose.model('Expense', expenseSchema);