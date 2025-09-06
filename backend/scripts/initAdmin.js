const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config/config');

const initAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: config.ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = new User({
      fullName: 'Society Administrator',
      email: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD,
      phoneNumber: '9999999999',
      role: 'admin',
      status: 'approved',
      residentType: 'Owner'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log(`Email: ${config.ADMIN_EMAIL}`);
    console.log(`Password: ${config.ADMIN_PASSWORD}`);
    
  } catch (error) {
    console.error('Error initializing admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
initAdmin();
