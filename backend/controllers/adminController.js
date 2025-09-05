const User = require('../models/User');
const FamilyMember = require('../models/FamilyMember');
const Vehicle = require('../models/Vehicle');
const Notice = require('../models/Notice');
const Complaint = require('../models/Complaint');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalResidents,
      pendingResidents,
      totalComplaints,
      pendingComplaints,
      totalNotices,
      totalVehicles
    ] = await Promise.all([
      User.countDocuments({ role: 'resident', status: 'approved' }),
      User.countDocuments({ role: 'resident', status: 'pending' }),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'pending' }),
      Notice.countDocuments({ isActive: true }),
      Vehicle.countDocuments()
    ]);

    // Get recent activities
    const recentComplaints = await Complaint.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentResidents = await User.find({ role: 'resident' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName email status createdAt');

    res.json({
      success: true,
      data: {
        stats: {
          totalResidents,
          pendingResidents,
          totalComplaints,
          pendingComplaints,
          totalNotices,
          totalVehicles
        },
        recentActivities: {
          complaints: recentComplaints,
          residents: recentResidents
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get all residents with pagination and filters
const getResidents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    const filter = { role: 'resident' };
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { wing: { $regex: search, $options: 'i' } },
        { flatNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const residents = await User.find(filter)
      .select('-password')
      .populate('familyMembers')
      .populate('vehicles')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        residents,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get residents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch residents',
      error: error.message
    });
  }
};

// Approve or reject resident
const updateResidentStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either approved or rejected'
      });
    }

    const updateData = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `Resident ${status} successfully`,
      data: { user }
    });
  } catch (error) {
    console.error('Update resident status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resident status',
      error: error.message
    });
  }
};

// Get all complaints with pagination and filters
const getComplaints = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const category = req.query.category;

    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (category) {
      filter.category = category;
    }

    const complaints = await Complaint.find(filter)
      .populate('userId', 'fullName email wing flatNumber')
      .populate('adminId', 'fullName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      data: {
        complaints,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints',
      error: error.message
    });
  }
};

// Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, adminResponse } = req.body;

    if (!['pending', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { 
      status,
      adminId: req.user._id
    };

    if (adminResponse) {
      updateData.adminResponse = adminResponse;
    }

    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'fullName email wing flatNumber');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      data: { complaint }
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint status',
      error: error.message
    });
  }
};

// Delete complaint
const deleteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findByIdAndDelete(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete complaint',
      error: error.message
    });
  }
};

// Get all vehicles
const getVehicles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const vehicleType = req.query.vehicleType;
    const search = req.query.search;

    const filter = {};
    
    if (vehicleType) {
      filter.vehicleType = vehicleType;
    }
    
    if (search) {
      filter.$or = [
        { vehicleName: { $regex: search, $options: 'i' } },
        { vehicleNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const vehicles = await Vehicle.find(filter)
      .populate('userId', 'fullName email wing flatNumber')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Vehicle.countDocuments(filter);

    res.json({
      success: true,
      data: {
        vehicles,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicles',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getResidents,
  updateResidentStatus,
  getComplaints,
  updateComplaintStatus,
  deleteComplaint,
  getVehicles
};
