const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    vehicleType: {
        type: String,
        required: [true, 'Vehicle type is required'],
        enum: ['Car', 'Bike', 'EV', 'Truck', 'Bus'],
        trim: true
    },
    vehicleName: {
        type: String,
        required: [true, 'Vehicle name is required'],
        trim: true,
        maxlength: [50, 'Vehicle name cannot exceed 50 characters']
    },
    vehicleModel: {
        type: String,
        required: [true, 'Vehicle model is required'],
        trim: true,
        maxlength: [50, 'Vehicle model cannot exceed 50 characters']
    },
    vehicleColor: {
        type: String,
        required: [true, 'Vehicle color is required'],
        trim: true,
        maxlength: [30, 'Vehicle color cannot exceed 30 characters']
    },
    vehicleNumber: {
        type: String,
        required: [true, 'Vehicle number is required'],
        unique: true,
        uppercase: true,
        match: [/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/, 'Please enter a valid vehicle number (e.g., MH04AB1234)'],
        trim: true
    },
    parkingSlot: {
        type: String,
        required: [true, 'Parking slot is required'],
        unique: true,
        match: [/^[A-F]-([1-9]|1[0-9])[1-9]-P[1-2]$/, 'Please enter a valid parking slot format (e.g., B-503-P1)'],
        trim: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'approved', 'rejected'],
            message: 'Status must be either pending, approved, or rejected'
        },
        default: 'pending'
    }
}, {
    timestamps: true // This adds both createdAt and updatedAt automatically
});

// Indexes for better query performance
vehicleSchema.index({userId: 1});
vehicleSchema.index({vehicleNumber: 1}, {unique: true});
vehicleSchema.index({parkingSlot: 1}, {unique: true});
vehicleSchema.index({status: 1});
vehicleSchema.index({createdAt: -1});

module.exports = mongoose.model('Vehicle', vehicleSchema);
