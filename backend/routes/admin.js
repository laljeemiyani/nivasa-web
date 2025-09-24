const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getResidents,
    updateResidentStatus,
    getComplaints,
    updateComplaintStatus,
    deleteComplaint,
    getVehicles,
    updateVehicleStatus
} = require('../controllers/adminController');
const adminNotificationController = require('../controllers/adminNotificationController');
const {authenticateToken, requireAdmin} = require('../middlewares/auth');
const {validatePagination, validateObjectId} = require('../middlewares/validation');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Resident management
router.get('/residents', validatePagination, getResidents);
router.put('/residents/:userId/status', validateObjectId('userId'), updateResidentStatus);

// Complaint management
router.get('/complaints', validatePagination, getComplaints);
router.put('/complaints/:complaintId/status', validateObjectId('complaintId'), updateComplaintStatus);
router.delete('/complaints/:complaintId', validateObjectId('complaintId'), deleteComplaint);

// Vehicle management
router.get('/vehicles', validatePagination, getVehicles);
router.put('/vehicles/:vehicleId/status', validateObjectId('vehicleId'), updateVehicleStatus);

// Notification management
router.post('/notifications/all', adminNotificationController.createNotificationForAllResidents);
router.post('/notifications/resident', adminNotificationController.createNotificationForResident);

module.exports = router;
