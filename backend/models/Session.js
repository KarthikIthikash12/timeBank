// models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skill: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 15, 
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed', 'canceled', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String,
      maxLength: 500,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5, 
    },
    reviewText: {
      type: String,
      maxLength: 1000, 
    },
    meetingLink: {
      type: String, 
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Session', sessionSchema);