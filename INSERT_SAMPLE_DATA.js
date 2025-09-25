// Script to insert sample data into MongoDB for demonstration
// Run this script using: node INSERT_SAMPLE_DATA.js

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./backend/models/User');
const Vehicle = require('./backend/models/Vehicle');
const Notice = require('./backend/models/Notice');
const Complaint = require('./backend/models/Complaint');
const FamilyMember = require('./backend/models/FamilyMember');
const Notification = require('./backend/models/Notification');

// Database connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nivasa_society');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

// Sample data
const adminUser = {
    fullName: "System Administrator",
    email: "admin@nivasa.com",
    password: "admin123",
    phoneNumber: "9876543210",
    age: 35,
    gender: "Male",
    role: "admin",
    status: "approved"
};

const residentUsers = [
    {
        fullName: "Rajesh Kumar",
        email: "rajesh.kumar@gmail.com",
        password: "resident123",
        phoneNumber: "9876543211",
        age: 42,
        gender: "Male",
        wing: "A",
        flatNumber: "101",
        residentType: "Owner",
        role: "resident",
        status: "approved"
    },
    {
        fullName: "Priya Sharma",
        email: "priya.sharma@gmail.com",
        password: "resident123",
        phoneNumber: "9876543212",
        age: 38,
        gender: "Female",
        wing: "B",
        flatNumber: "202",
        residentType: "Tenant",
        role: "resident",
        status: "approved"
    },
    {
        fullName: "Amit Patel",
        email: "amit.patel@gmail.com",
        password: "resident123",
        phoneNumber: "9876543213",
        age: 35,
        gender: "Male",
        wing: "C",
        flatNumber: "303",
        residentType: "Owner",
        role: "resident",
        status: "approved"
    }
];

const sampleNotices = [
    {
        title: "Annual Maintenance Schedule",
        description: "Please note that the annual maintenance of common areas will be conducted from 15th-20th of this month. Water supply may be interrupted during certain hours.",
        priority: "medium",
        category: "maintenance",
        isActive: true
    },
    {
        title: "Security Guidelines Update",
        description: "New security guidelines have been implemented. All visitors must be registered at the gate. Residents are requested to cooperate with security personnel.",
        priority: "high",
        category: "security",
        isActive: true
    },
    {
        title: "Community Diwali Celebration",
        description: "Join us for the community Diwali celebration on 12th November at the clubhouse from 6 PM onwards. Delicious food and entertainment will be provided.",
        priority: "medium",
        category: "event",
        isActive: true
    }
];

const sampleComplaints = [
    {
        title: "Water Leakage in Bathroom",
        description: "There is water leakage in the bathroom of flat A-101. Please arrange for plumbing inspection at the earliest.",
        category: "plumbing",
        priority: "high",
        status: "open"
    },
    {
        title: "Elevator Not Working",
        description: "The elevator in Block B is not functioning properly. It stops between floors and makes strange noises.",
        category: "electrical",
        priority: "medium",
        status: "in_progress"
    },
    {
        title: "Street Light Outage",
        description: "Street lights near parking area C are not working since last week. This creates safety concerns during night.",
        category: "electrical",
        priority: "low",
        status: "resolved"
    }
];

const sampleFamilyMembers = [
    {
        fullName: "Sunita Kumari",
        relation: "Spouse",
        phone: "9876543214",
        email: "sunita.kumari@gmail.com",
        age: 38,
        gender: "Female"
    },
    {
        fullName: "Rohan Kumar",
        relation: "Child",
        phone: "9876543215",
        email: "rohan.kumari@gmail.com",
        age: 15,
        gender: "Male"
    },
    {
        fullName: "Ankit Sharma",
        relation: "Spouse",
        phone: "9876543216",
        email: "ankit.sharma@gmail.com",
        age: 40,
        gender: "Male"
    }
];

const sampleVehicles = [
    {
        vehicleType: "Car",
        vehicleName: "Toyota",
        vehicleModel: "Camry",
        vehicleColor: "Silver",
        vehicleNumber: "MH04AB1234",
        parkingSlot: "A-101-P1",
        status: "approved"
    },
    {
        vehicleType: "Bike",
        vehicleName: "Honda",
        vehicleModel: "Activa",
        vehicleColor: "Red",
        vehicleNumber: "DL05CD5678",
        parkingSlot: "B-202-P2",
        status: "approved"
    },
    {
        vehicleType: "EV",
        vehicleName: "Tesla",
        vehicleModel: "Model 3",
        vehicleColor: "White",
        vehicleNumber: "KA06EF9012",
        parkingSlot: "C-303-P1",
        status: "approved"
    }
];

const sampleNotifications = [
    {
        title: "Vehicle Registration Approved",
        message: "Your vehicle registration for MH04AB1234 has been approved by the admin.",
        type: "success",
        relatedModel: "Vehicle",
        isRead: false
    },
    {
        title: "Complaint Status Updated",
        message: "Your complaint about elevator has been marked as 'In Progress'. Technician will visit today.",
        type: "info",
        relatedModel: "Complaint",
        isRead: false
    },
    {
        title: "Maintenance Notice",
        message: "Annual maintenance scheduled for common areas. Please check notices section for details.",
        type: "warning",
        relatedModel: "Notice",
        isRead: true
    }
];

// Insert sample data
const insertSampleData = async () => {
    try {
        // Clear existing data (optional - uncomment if you want to start fresh)
        // await User.deleteMany({});
        // await Vehicle.deleteMany({});
        // await Notice.deleteMany({});
        // await Complaint.deleteMany({});
        // await FamilyMember.deleteMany({});
        // await Notification.deleteMany({});

        console.log('Inserting sample data...');

        // Insert admin user
        const admin = await User.create(adminUser);
        console.log('Admin user inserted:', admin.fullName);

        // Insert resident users
        const residents = [];
        for (let i = 0; i < residentUsers.length; i++) {
            const resident = await User.create(residentUsers[i]);
            residents.push(resident);
            console.log(`Resident ${i + 1} inserted:`, resident.fullName);
        }

        // Insert notices (linked to admin)
        const notices = [];
        for (let i = 0; i < sampleNotices.length; i++) {
            const noticeData = {
                ...sampleNotices[i],
                userId: admin._id
            };
            const notice = await Notice.create(noticeData);
            notices.push(notice);
            console.log(`Notice ${i + 1} inserted:`, notice.title);
        }

        // Insert complaints (linked to residents)
        const complaints = [];
        for (let i = 0; i < sampleComplaints.length; i++) {
            const complaintData = {
                ...sampleComplaints[i],
                userId: residents[i % residents.length]._id
            };
            const complaint = await Complaint.create(complaintData);
            complaints.push(complaint);
            console.log(`Complaint ${i + 1} inserted:`, complaint.title);
        }

        // Insert family members (linked to residents)
        const familyMembers = [];
        for (let i = 0; i < sampleFamilyMembers.length; i++) {
            const familyData = {
                ...sampleFamilyMembers[i],
                userId: residents[i % residents.length]._id
            };
            const familyMember = await FamilyMember.create(familyData);
            familyMembers.push(familyMember);
            console.log(`Family member ${i + 1} inserted:`, familyMember.fullName);
        }

        // Insert vehicles (linked to residents)
        const vehicles = [];
        for (let i = 0; i < sampleVehicles.length; i++) {
            const vehicleData = {
                ...sampleVehicles[i],
                userId: residents[i % residents.length]._id
            };
            const vehicle = await Vehicle.create(vehicleData);
            vehicles.push(vehicle);
            console.log(`Vehicle ${i + 1} inserted:`, vehicle.vehicleName);
        }

        // Insert notifications (linked to residents)
        const notifications = [];
        for (let i = 0; i < sampleNotifications.length; i++) {
            const notificationData = {
                ...sampleNotifications[i],
                userId: residents[i % residents.length]._id
            };
            const notification = await Notification.create(notificationData);
            notifications.push(notification);
            console.log(`Notification ${i + 1} inserted:`, notification.title);
        }

        console.log('\n✅ Sample data insertion completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`  - Admin users: 1`);
        console.log(`  - Resident users: ${residents.length}`);
        console.log(`  - Notices: ${notices.length}`);
        console.log(`  - Complaints: ${complaints.length}`);
        console.log(`  - Family members: ${familyMembers.length}`);
        console.log(`  - Vehicles: ${vehicles.length}`);
        console.log(`  - Notifications: ${notifications.length}`);

        console.log('\n📝 NOTE: Remember the user IDs for demo purposes:');
        console.log(`  - Admin ID: ${admin._id}`);
        console.log(`  - Resident 1 ID: ${residents[0]._id}`);
        console.log(`  - Resident 2 ID: ${residents[1]._id}`);
        console.log(`  - Resident 3 ID: ${residents[2]._id}`);

    } catch (error) {
        console.error('❌ Error inserting sample data:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔒 Database connection closed.');
    }
};

// Run the script
const run = async () => {
    await connectDB();
    await insertSampleData();
};

if (require.main === module) {
    run();
}

module.exports = {insertSampleData};