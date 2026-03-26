const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  reason: { 
    type: String, 
    required: true 
  }, 
  scheduledDate: {
    type: String, 
  },
  isReviewed: {
    type: Boolean,
    default: false
  },
  ratingGiven: {
    type: Number
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'cancelled', 'completed'],
    default: 'pending'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);