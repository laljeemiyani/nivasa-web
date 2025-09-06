const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  relation: {
    type: String,
    required: [true, 'Relation is required'],
    trim: true,
    maxlength: [50, 'Relation cannot exceed 50 characters']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [15, 'Phone number cannot exceed 15 characters']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  age: {
    type: Number,
    min: [1, 'Age must be positive'],
    max: [120, 'Age cannot exceed 120']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  }
}, {
  timestamps: true
});

// Index for better query performance
familyMemberSchema.index({ userId: 1 });

module.exports = mongoose.model('FamilyMember', familyMemberSchema);
