const {body, param, query, validationResult} = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// User registration validation
const validateUserRegistration = [
    body('fullName')
        .trim()
        .isLength({min: 2, max: 100})
        .withMessage('Full name must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long'),
    body('phoneNumber')
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be exactly 10 digits'),
    body('residentType')
        .isIn(['Owner', 'Tenant'])
        .withMessage('Resident type must be either Owner or Tenant'),
    body('wing')
        .optional()
        .trim()
        .matches(/^[A-F]$/)
        .withMessage('Wing must be a single letter from A to F'),
    body('flatNumber')
        .optional()
        .trim()
        .matches(/^(([1-9]|1[0-4])0[1-4]|([1-9]|1[0-4])(0[1-4]))$/)
        .withMessage('Flat number must be in format: 101-104, 201-204, ..., 1401-1404 (floors 1-14, flats 01-04)'),
    body('age')
        .optional()
        .isInt({min: 18, max: 120})
        .withMessage('Age must be between 18 and 120 years (only adults can register)'),
    body('gender')
        .optional()
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),
    handleValidationErrors
];

// User login validation
const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Family member validation
const validateFamilyMember = [
    body('fullName')
        .trim()
        .isLength({min: 2, max: 100})
        .withMessage('Full name must be between 2 and 100 characters'),
    body('relation')
        .trim()
        .isLength({min: 2, max: 50})
        .withMessage('Relation must be between 2 and 50 characters'),
    body('phone')
        .optional()
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be exactly 10 digits'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('age')
        .optional()
        .isInt({min: 1, max: 120})
        .withMessage('Age must be between 1 and 120'),
    body('gender')
        .optional()
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),
    handleValidationErrors
];

// Vehicle validation
const validateVehicle = [
    body('vehicleType')
        .notEmpty()
        .trim()
        .withMessage('Vehicle type is required'),

    body('manufacturer')
        .notEmpty()
        .trim()
        .isLength({min: 2, max: 100})
        .withMessage('Vehicle name must be between 2 and 100 characters'),

    body('registrationNumber')
        .notEmpty()
        .trim()
        .matches(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/i)
        .withMessage('Vehicle number must be a valid Indian registration number (e.g., KA01AB1234)'),

    body('model')
        .optional({checkFalsy: true})
        .trim()
        .isLength({max: 50})
        .withMessage('Vehicle model cannot exceed 50 characters'),

    body('color')
        .optional({checkFalsy: true})
        .trim()
        .isLength({max: 30})
        .withMessage('Vehicle color cannot exceed 30 characters'),

    handleValidationErrors,
];

// Notice validation
const validateNotice = [
    body('title')
        .trim()
        .isLength({min: 5, max: 255})
        .withMessage('Title must be between 5 and 255 characters'),
    body('description')
        .trim()
        .isLength({min: 10})
        .withMessage('Description must be at least 10 characters long'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    body('category')
        .optional()
        .isIn(['general', 'maintenance', 'security', 'event', 'payment', 'other'])
        .withMessage('Invalid category'),
    handleValidationErrors
];

// Complaint validation
const validateComplaint = [
    body('title')
        .trim()
        .isLength({min: 5, max: 255})
        .withMessage('Title must be between 5 and 255 characters'),
    body('description')
        .trim()
        .isLength({min: 10})
        .withMessage('Description must be at least 10 characters long'),
    body('category')
        .isIn(['plumbing', 'electrical', 'security', 'maintenance', 'noise', 'parking', 'cleaning', 'other'])
        .withMessage('Invalid complaint category'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Priority must be low, medium, high, or urgent'),
    handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => [
    param(paramName)
        .isMongoId()
        .withMessage(`Invalid ${paramName} ID`),
    handleValidationErrors
];

// Query validation for pagination
const validatePagination = [
    query('page')
        .optional()
        .isInt({min: 1})
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({min: 1, max: 100})
        .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateUserRegistration,
    validateUserLogin,
    validateFamilyMember,
    validateVehicle,
    validateNotice,
    validateComplaint,
    validateObjectId,
    validatePagination
};
