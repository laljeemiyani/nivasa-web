const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getResidents,
  updateResidentStatus,
  getComplaints,
  updateComplaintStatus,
  deleteComplaint,
  getVehicles
} = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');
const { validatePagination, validateObjectId } = require('../middlewares/validation');

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

module.exports = router;
