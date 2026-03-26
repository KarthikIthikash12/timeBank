const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, 
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: false, 
        },
        googleId: {
            type: String,
            required: false,
            unique: true,
            sparse: true, 
        }, 
        profilePicture: {
            type: String,
            default: '', 
        },
        timeBalance: {
            type: Number,
            default: 120,
            min: 0,
        },
        averageRating: {
            type: Number,
            default: 5.0
        },
        reviewCount: {
            type: Number,
            default: 0
        },
        pendingBalance: {
            type: Number,
            default: 0,
            min: 0, 
        },
        rating: {
            type: Number,
            default: 0, 
        },
        totalSessionsCompleted: {
            type: Number,
            default: 0, 
        },
        skillsOffered: [ {
            type: String,
            trim: true, 
        } 
        ], 
        sessionDuration: {
            type: Number,
            default: 60 
        },
            availableSlots: {
            type: [String],
            default: [] 
        },
            sessionTitle: {
            type: String,
            default: ''
        },
            topics: {
            type: String,
            default: ''
        },
            category: {
            type: String,
            required: true, 
            default: 'Programming' 

  },
        availableHours: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          required: true,
        },
        startTime: {
          type: String, 
          required: true,
        },
        endTime: {
          type: String, 
          required: true,
        }
      }
    ],
        resetPasswordToken: String,
        resetPasswordExpire: Date, 
    },
    {
        timestamps: true, 
    }
); 

module.exports = mongoose.model('User', userSchema); 