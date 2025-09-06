const Notice = require('../models/Notice');

// Create new notice (Admin only)
const createNotice = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      category,
      expiryDate
    } = req.body;

    const notice = new Notice({
      userId: req.user._id,
      title,
      description,
      priority: priority || 'medium',
      category: category || 'general',
      expiryDate: expiryDate ? new Date(expiryDate) : null
    });

    await notice.save();

    const populatedNotice = await Notice.findById(notice._id)
      .populate('userId', 'fullName');

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: { notice: populatedNotice }
    });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notice',
      error: error.message
    });
  }
};

// Get all notices with pagination and filters
const getNotices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const priority = req.query.priority;
    const isActive = req.query.isActive !== 'false'; // Default to true

    const filter = { isActive };
    
    if (category) {
      filter.category = category;
    }
    
    if (priority) {
      filter.priority = priority;
    }

    // Filter out expired notices
    filter.$or = [
      { expiryDate: null },
      { expiryDate: { $gt: new Date() } }
    ];

    const notices = await Notice.find(filter)
      .populate('userId', 'fullName')
      .sort({ priority: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notice.countDocuments(filter);

    res.json({
      success: true,
      data: {
        notices,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notices',
      error: error.message
    });
  }
};

// Get single notice
const getNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;

    const notice = await Notice.findById(noticeId)
      .populate('userId', 'fullName');

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.json({
      success: true,
      data: { notice }
    });
  } catch (error) {
    console.error('Get notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notice',
      error: error.message
    });
  }
};

// Update notice (Admin only)
const updateNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const {
      title,
      description,
      priority,
      category,
      isActive,
      expiryDate
    } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (priority) updateData.priority = priority;
    if (category) updateData.category = category;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (expiryDate) updateData.expiryDate = new Date(expiryDate);

    const notice = await Notice.findByIdAndUpdate(
      noticeId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'fullName');

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.json({
      success: true,
      message: 'Notice updated successfully',
      data: { notice }
    });
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notice',
      error: error.message
    });
  }
};

// Delete notice (Admin only)
const deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;

    const notice = await Notice.findByIdAndDelete(noticeId);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notice',
      error: error.message
    });
  }
};

// Get notice statistics (Admin only)
const getNoticeStats = async (req, res) => {
  try {
    const [
      totalNotices,
      activeNotices,
      expiredNotices,
      noticesByCategory,
      noticesByPriority
    ] = await Promise.all([
      Notice.countDocuments(),
      Notice.countDocuments({ isActive: true }),
      Notice.countDocuments({ 
        isActive: true,
        expiryDate: { $lt: new Date() }
      }),
      Notice.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Notice.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalNotices,
        activeNotices,
        expiredNotices,
        noticesByCategory,
        noticesByPriority
      }
    });
  } catch (error) {
    console.error('Get notice stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notice statistics',
      error: error.message
    });
  }
};

module.exports = {
  createNotice,
  getNotices,
  getNotice,
  updateNotice,
  deleteNotice,
  getNoticeStats
};
