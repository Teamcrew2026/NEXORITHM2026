const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  college: {
    type: String,
    required: [true, 'College name is required'],
    trim: true,
    index: true
  },
  dept: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Valid email is required'],
    trim: true,
    lowercase: true,
    index: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    index: true
  },
  events: {
    type: [String],
    required: [true, 'Event selections are required'],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one event must be selected'
    }
  },
  teamSize: {
    type: Number,
    default: 1
  },
  teamMembers: {
    type: [String],
    default: function () {
      return [this.fullName];
    }
  },
  amount: {
    type: Number,
    default: 150.00
  },
  paymentMethod: {
    type: String,
    default: 'UPI / GPay'
  },
  transactionId: {
    type: String,
    required: [true, 'Transaction UTR / Reference ID is required'],
    trim: true
  },
  screenshot: {
    type: String,
    default: ''
  },
  paymentVerified: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
      delete ret._id;
      return ret;
    }
  }
});

// Composite text search index for fast multi-field searching
registrationSchema.index({
  id: 'text',
  fullName: 'text',
  college: 'text',
  email: 'text',
  phone: 'text',
  transactionId: 'text'
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
