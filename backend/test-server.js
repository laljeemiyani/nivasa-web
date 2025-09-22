const express = require('express');
const cors = require('cors');
const path = require('path');

const config = require('./config/config');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const noticeRoutes = require('./routes/notices');
const complaintRoutes = require('./routes/complaints');
const familyRoutes = require('./routes/family');
const vehicleRoutes = require('./routes/vehicles');

// Connect DB
connectDB();

// Init admin
const initAdmin = require('./scripts/initAdmin');
initAdmin();

const app = express();

// ✅ Fix CORS
app.use(cors({
    origin: config.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logs
if (config.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Nivasa Society Management API is running',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV
    });
});

// Root
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Nivasa Society Management System API',
        version: '1.0.0',
        documentation: '/api/health'
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(config.NODE_ENV === 'development' && { stack: error.stack })
    });
});

const PORT = config.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Frontend URL: ${config.FRONTEND_URL || 'http://localhost:5173'}`);
});
