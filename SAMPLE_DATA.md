# Sample Data for Nivasa Society Management System

## Overview

This document contains sample data for all collections in the database. Each entity has 3 sample records that you can
use to demonstrate INSERT, UPDATE, and DELETE operations.

## Table of Contents

1. [Users (Residents & Admin)](#users-residents--admin)
2. [Vehicles](#vehicles)
3. [Notices](#notices)
4. [Complaints](#complaints)
5. [Family Members](#family-members)
6. [Notifications](#notifications)

---

## Users (Residents & Admin)

### Admin User

```json
{
  "fullName": "System Administrator",
  "email": "admin@nivasa.com",
  "password": "admin123",
  "phoneNumber": "9876543210",
  "age": 35,
  "gender": "Male",
  "role": "admin",
  "status": "approved"
}
```

### Resident Users

```json
[
  {
    "fullName": "Rajesh Kumar",
    "email": "rajesh.kumar@gmail.com",
    "password": "resident123",
    "phoneNumber": "9876543211",
    "age": 42,
    "gender": "Male",
    "wing": "A",
    "flatNumber": "101",
    "residentType": "Owner",
    "role": "resident",
    "status": "approved"
  },
  {
    "fullName": "Priya Sharma",
    "email": "priya.sharma@gmail.com",
    "password": "resident123",
    "phoneNumber": "9876543212",
    "age": 38,
    "gender": "Female",
    "wing": "B",
    "flatNumber": "202",
    "residentType": "Tenant",
    "role": "resident",
    "status": "approved"
  },
  {
    "fullName": "Amit Patel",
    "email": "amit.patel@gmail.com",
    "password": "resident123",
    "phoneNumber": "9876543213",
    "age": 35,
    "gender": "Male",
    "wing": "C",
    "flatNumber": "303",
    "residentType": "Owner",
    "role": "resident",
    "status": "approved"
  }
]
```

---

## Vehicles

### Sample Vehicle Records

```json
[
  {
    "userId": "[RAJESH_KUMAR_USER_ID]",
    "vehicleType": "Car",
    "vehicleName": "Toyota",
    "vehicleModel": "Camry",
    "vehicleColor": "Silver",
    "vehicleNumber": "MH04AB1234",
    "parkingSlot": "A-101-P1",
    "status": "approved"
  },
  {
    "userId": "[PRIYA_SHARMA_USER_ID]",
    "vehicleType": "Bike",
    "vehicleName": "Honda",
    "vehicleModel": "Activa",
    "vehicleColor": "Red",
    "vehicleNumber": "DL05CD5678",
    "parkingSlot": "B-202-P2",
    "status": "approved"
  },
  {
    "userId": "[AMIT_PATEL_USER_ID]",
    "vehicleType": "EV",
    "vehicleName": "Tesla",
    "vehicleModel": "Model 3",
    "vehicleColor": "White",
    "vehicleNumber": "KA06EF9012",
    "parkingSlot": "C-303-P1",
    "status": "approved"
  }
]
```

---

## Notices

### Sample Notice Records

```json
[
  {
    "userId": "[ADMIN_USER_ID]",
    "title": "Annual Maintenance Schedule",
    "description": "Please note that the annual maintenance of common areas will be conducted from 15th-20th of this month. Water supply may be interrupted during certain hours.",
    "priority": "medium",
    "category": "maintenance",
    "isActive": true
  },
  {
    "userId": "[ADMIN_USER_ID]",
    "title": "Security Guidelines Update",
    "description": "New security guidelines have been implemented. All visitors must be registered at the gate. Residents are requested to cooperate with security personnel.",
    "priority": "high",
    "category": "security",
    "isActive": true
  },
  {
    "userId": "[ADMIN_USER_ID]",
    "title": "Community Diwali Celebration",
    "description": "Join us for the community Diwali celebration on 12th November at the clubhouse from 6 PM onwards. Delicious food and entertainment will be provided.",
    "priority": "medium",
    "category": "event",
    "isActive": true
  }
]
```

---

## Complaints

### Sample Complaint Records

```json
[
  {
    "userId": "[RAJESH_KUMAR_USER_ID]",
    "title": "Water Leakage in Bathroom",
    "description": "There is water leakage in the bathroom of flat A-101. Please arrange for plumbing inspection at the earliest.",
    "category": "plumbing",
    "priority": "high",
    "status": "open"
  },
  {
    "userId": "[PRIYA_SHARMA_USER_ID]",
    "title": "Elevator Not Working",
    "description": "The elevator in Block B is not functioning properly. It stops between floors and makes strange noises.",
    "category": "electrical",
    "priority": "medium",
    "status": "in_progress"
  },
  {
    "userId": "[AMIT_PATEL_USER_ID]",
    "title": "Street Light Outage",
    "description": "Street lights near parking area C are not working since last week. This creates safety concerns during night.",
    "category": "electrical",
    "priority": "low",
    "status": "resolved"
  }
]
```

---

## Family Members

### Sample Family Member Records

```json
[
  {
    "userId": "[RAJESH_KUMAR_USER_ID]",
    "fullName": "Sunita Kumari",
    "relation": "Spouse",
    "phone": "9876543214",
    "email": "sunita.kumari@gmail.com",
    "age": 38,
    "gender": "Female"
  },
  {
    "userId": "[RAJESH_KUMAR_USER_ID]",
    "fullName": "Rohan Kumar",
    "relation": "Child",
    "phone": "9876543215",
    "email": "rohan.kumar@gmail.com",
    "age": 15,
    "gender": "Male"
  },
  {
    "userId": "[PRIYA_SHARMA_USER_ID]",
    "fullName": "Ankit Sharma",
    "relation": "Spouse",
    "phone": "9876543216",
    "email": "ankit.sharma@gmail.com",
    "age": 40,
    "gender": "Male"
  }
]
```

---

## Notifications

### Sample Notification Records

```json
[
  {
    "userId": "[RAJESH_KUMAR_USER_ID]",
    "title": "Vehicle Registration Approved",
    "message": "Your vehicle registration for MH04AB1234 has been approved by the admin.",
    "type": "success",
    "relatedModel": "Vehicle",
    "isRead": false
  },
  {
    "userId": "[PRIYA_SHARMA_USER_ID]",
    "title": "Complaint Status Updated",
    "message": "Your complaint about elevator has been marked as 'In Progress'. Technician will visit today.",
    "type": "info",
    "relatedModel": "Complaint",
    "isRead": false
  },
  {
    "userId": "[AMIT_PATEL_USER_ID]",
    "title": "Maintenance Notice",
    "message": "Annual maintenance scheduled for common areas. Please check notices section for details.",
    "type": "warning",
    "relatedModel": "Notice",
    "isRead": true
  }
]
```

---

## How to Use This Data

### For INSERT Operations:

1. Use the sample records above as templates
2. Add new records with similar structure but different data
3. Demonstrate creating new users, vehicles, notices, complaints, family members

### For UPDATE Operations:

1. Modify existing records from the samples above
2. Change field values like status, priority, descriptions
3. Update vehicle details, notice categories, complaint statuses

### For DELETE Operations:

1. Remove any of the sample records
2. Show deletion of vehicles, complaints, family members
3. Demonstrate soft delete vs hard delete if applicable

### Important Notes:

- Replace `[USER_ID_PLACEHOLDERS]` with actual user IDs from your database
- All passwords are sample values - use appropriate hashing in actual implementation
- Vehicle numbers follow Indian registration format (XX00XX0000)
- Parking slots follow format: Wing-Floor-ParkingSpot (X-NNN-PN)
- Dates will be automatically set by the system (createdAt, updatedAt)

This data covers all major functionalities of the system and provides comprehensive examples for your presentation.