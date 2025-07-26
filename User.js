const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    defaultLanguage: {
      type: String,
      default: 'en'
    },
    autoColoring: {
      type: Boolean,
      default: false
    },
    coloringStyle: {
      type: String,
      enum: ['vibrant', 'soft', 'realistic', 'anime'],
      default: 'anime'
    },
    textStyle: {
      fontSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium'
      },
      fontFamily: {
        type: String,
        default: 'Arial'
      }
    }
  },
  processingHistory: [{
    originalImage: String,
    processedImage: String,
    settings: {
      targetLanguage: String,
      enableColoring: Boolean,
      coloringStyle: String
    },
    processedAt: {
      type: Date,
      default: Date.now
    }
  }],
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
    },
    expiresAt: Date,
    processingQuota: {
      type: Number,
      default: 10
    },
    used: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.canProcess = function() {
  return this.subscription.used < this.subscription.processingQuota;
};

userSchema.methods.incrementUsage = function() {
  this.subscription.used += 1;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);