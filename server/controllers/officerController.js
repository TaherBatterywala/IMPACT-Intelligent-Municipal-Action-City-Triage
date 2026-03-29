const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Get officer dashboard stats
// @route   GET /api/officer/stats
// @access  Private (Officer)
const getStats = asyncHandler(async (req, res) => {
    // Total complaints for this department
    const total = await Complaint.countDocuments({ category: req.user.department });
    const pending = await Complaint.countDocuments({ category: req.user.department, status: 'Pending' });
    const resolved = await Complaint.countDocuments({ category: req.user.department, status: 'Resolved' });

    res.status(200).json({
        total,
        pending,
        resolved
    });
});

// @desc    Assign complaint to junior (or self for simplicity if no juniors in DB)
// @route   PUT /api/officer/assign/:id
// @access  Private (Officer)
const assignComplaint = asyncHandler(async (req, res) => {
    // For demo, we might just set status to "Assigned" and maybe update assignedTo if we had a list of juniors
    // The prompt says "select a junior officer name (dummy list)".
    // We will just update status to 'Assigned' and 'In Progress' for now, or assign to self if not specified.

    // In a real app, req.body.juniorId would be passed.

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
        res.status(404);
        throw new Error('Complaint not found');
    }

    if (complaint.category !== req.user.department) {
        res.status(401);
        throw new Error('Not authorized for this department');
    }

    const { assignedToId } = req.body; // Logic to assign to specific officer

    complaint.status = 'Assigned';
    complaint.assignedTo = assignedToId || req.user.id;
    await complaint.save();

    res.status(200).json(complaint);
});

// @desc    Mark complaint as resolved
// @route   PUT /api/officer/resolve/:id
// @access  Private (Officer)
const resolveComplaint = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
        res.status(404);
        throw new Error('Complaint not found');
    }

    // Check if assigned to this officer or same department
    if (complaint.category !== req.user.department) {
        res.status(401);
        throw new Error('Not authorized for this department');
    }

    complaint.status = 'Resolved';
    await complaint.save();

    // Notify user
    const user = await User.findById(complaint.userId);
    if (user) {
        user.notifications.push({
            message: `Your complaint regarding ${complaint.subCategory} has been resolved.`
        });
        await user.save();
    }

    res.status(200).json(complaint);
});

// @desc    Message user
// @route   POST /api/officer/message/:id
// @access  Private (Officer)
const messageUser = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
        res.status(404);
        throw new Error('Complaint not found');
    }

    const user = await User.findById(complaint.userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.notifications.push({
        message: `Message from Officer ${req.user.name}: ${message}`
    });
    await user.save();

    complaint.messages.push({
        sender: `Officer ${req.user.name}`,
        text: message
    });
    await complaint.save();

    res.status(200).json({ message: 'Notification sent' });
});

module.exports = {
    getStats,
    assignComplaint,
    resolveComplaint,
    messageUser
};
