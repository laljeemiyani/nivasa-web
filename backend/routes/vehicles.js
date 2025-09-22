const express = require('express');
const router = express.Router();
const {
    addVehicle,
    getUserVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');
const {
    getVehicles,
    updateVehicleStatus
} = require('../controllers/adminController'); // Assuming these functions are in adminController
const {authenticateToken, requireAdmin, requireResident} = require('../middlewares/auth');
const {validateVehicle, validatePagination, validateObjectId} = require('../middlewares/validation');

// All vehicle routes require authentication
router.use(authenticateToken);

// Resident routes
router.post('/', requireResident, validateVehicle, addVehicle);
router.get('/my', requireResident, getUserVehicles);
router.get('/:vehicleId', requireResident, validateObjectId('vehicleId'), getVehicle);
router.put('/:vehicleId', requireResident, validateObjectId('vehicleId'), updateVehicle);
router.delete('/:vehicleId', requireResident, validateObjectId('vehicleId'), deleteVehicle);

// Admin routes
router.get('/', requireAdmin, validatePagination, getVehicles); // This route will be for admin to list ALL vehicles
router.put('/:vehicleId/status', requireAdmin, validateObjectId('vehicleId'), updateVehicleStatus);

module.exports = router;