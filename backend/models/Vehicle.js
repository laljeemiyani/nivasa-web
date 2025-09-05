const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['Two Wheeler', 'Four Wheeler']
  },
  vehicleName: {
    type: String,
    required: [true, 'Vehicle name is required'],
    trim: true,
    maxlength: [100, 'Vehicle name cannot exceed 100 characters']
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    trim: true,
    uppercase: true,
    maxlength: [20, 'Vehicle number cannot exceed 20 characters']
  },
  vehicleModel: {
    type: String,
    trim: true,
    maxlength: [50, 'Vehicle model cannot exceed 50 characters']
  },
  vehicleColor: {
    type: String,
    trim: true,
    maxlength: [30, 'Vehicle color cannot exceed 30 characters']
  },
  registrationDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
vehicleSchema.index({ userId: 1 });
vehicleSchema.index({ vehicleNumber: 1 });

// Ensure unique vehicle number per user
vehicleSchema.index({ userId: 1, vehicleNumber: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
