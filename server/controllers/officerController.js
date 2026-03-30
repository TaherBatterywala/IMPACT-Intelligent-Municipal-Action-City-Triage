const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Get officer dashboard stats
// @route   GET /api/officer/stats
// @access  Private (Officer)
const getStats = asyncHandler(async (req, res) => {
    // Single aggregation instead of 3 separate countDocuments calls
    const stats = await Complaint.aggregate([
        { $match: { category: req.user.department } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const result = { total: 0, pending: 0, resolved: 0 };
    stats.forEach(s => {
        result.total += s.count;
        if (s._id === 'Pending') result.pending = s.count;
        if (s._id === 'Resolved') result.resolved = s.count;
    });

    res.status(200).json(result);
});

// @desc    Assign complaint to officer
// @route   PUT /api/officer/assign/:id
// @access  Private (Officer)
const assignComplaint = asyncHandler(async (req, res) => {
    const { assignedToId, assignedOfficerName } = req.body;

    // Single DB round-trip: findByIdAndUpdate instead of find + modify + save
    const updated = await Complaint.findOneAndUpdate(
        { _id: req.params.id, category: req.user.department },
        {
            status: 'Assigned',
            assignedTo: assignedToId || req.user.id,
            assignedOfficerName: assignedOfficerName || req.user.name || ''
        },
        { new: true, select: '-image -aiDetections' }
    ).lean();

    if (!updated) {
        res.status(404);
        throw new Error('Complaint not found or not authorized for this department');
    }

    res.status(200).json(updated);
});

// @desc    Mark complaint as resolved
// @route   PUT /api/officer/resolve/:id
// @access  Private (Officer)
const resolveComplaint = asyncHandler(async (req, res) => {
    // Update the complaint in one shot
    const updated = await Complaint.findOneAndUpdate(
        { _id: req.params.id, category: req.user.department },
        { status: 'Resolved' },
        { new: true, select: '-image -aiDetections' }
    ).lean();

    if (!updated) {
        res.status(404);
        throw new Error('Complaint not found or not authorized');
    }

    // Push notification to user in parallel — don't block the response
    User.findByIdAndUpdate(
        updated.userId,
        {
            $push: {
                notifications: {
                    message: `Your complaint regarding ${updated.subCategory} has been resolved.`
                }
            }
        }
    ).catch(err => console.error('Notification push failed:', err.message));

    res.status(200).json(updated);
});

// @desc    Message user
// @route   POST /api/officer/message/:id
// @access  Private (Officer)
const messageUser = asyncHandler(async (req, res) => {
    const { message } = req.body;

    const complaint = await Complaint.findById(req.params.id).select('userId subCategory messages').lean();
    if (!complaint) {
        res.status(404);
        throw new Error('Complaint not found');
    }

    // Run both DB writes in parallel
    await Promise.all([
        User.findByIdAndUpdate(complaint.userId, {
            $push: {
                notifications: {
                    message: `Message from Officer ${req.user.name}: ${message}`
                }
            }
        }),
        Complaint.findByIdAndUpdate(req.params.id, {
            $push: {
                messages: {
                    sender: `Officer ${req.user.name}`,
                    text: message
                }
            }
        })
    ]);

    res.status(200).json({ message: 'Notification sent' });
});

module.exports = {
    getStats,
    assignComplaint,
    resolveComplaint,
    messageUser
};
