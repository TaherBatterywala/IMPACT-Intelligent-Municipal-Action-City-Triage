const asyncHandler = require('express-async-handler');
const Challan = require('../models/Challan');
const User = require('../models/User');

// @desc    Issue a new challan
// @route   POST /api/challans
// @access  Private (Officer - Traffic Police)
const issueChallan = asyncHandler(async (req, res) => {
    if (req.user.department !== 'Traffic Police') {
        res.status(401);
        throw new Error('Not authorized to issue challans');
    }

    const { mobileNumber, vehicleNumber, amount, reason } = req.body;

    if (!mobileNumber || !vehicleNumber || !amount || !reason) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    const challan = await Challan.create({
        mobileNumber,
        vehicleNumber,
        amount,
        reason,
        issuedBy: req.user.id
    });

    res.status(201).json(challan);
});

// @desc    Get all challans issued by the logged-in officer
// @route   GET /api/challans/officer
// @access  Private (Officer - Traffic Police)
const getOfficerChallans = asyncHandler(async (req, res) => {
    if (req.user.department !== 'Traffic Police') {
        res.status(401);
        throw new Error('Not authorized to view officer challans');
    }

    const challans = await Challan.find({ issuedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(challans);
});

// @desc    Get user's challans by their registered mobile number
// @route   GET /api/challans/my
// @access  Private (Citizen)
const getMyChallans = asyncHandler(async (req, res) => {
    // req.user has phone according to User schema
    const mobileNumber = req.user.phone;
    
    if (!mobileNumber) {
        res.status(400);
        throw new Error('User has no registered mobile number');
    }

    const challans = await Challan.find({ mobileNumber }).sort({ createdAt: -1 });
    res.status(200).json(challans);
});

// @desc    Pay a challan
// @route   PUT /api/challans/:id/pay
// @access  Private (Citizen)
const payChallan = asyncHandler(async (req, res) => {
    const challan = await Challan.findById(req.params.id);

    if (!challan) {
        res.status(404);
        throw new Error('Challan not found');
    }

    // Ensure the challan belongs to the logged-in user
    if (challan.mobileNumber !== req.user.phone) {
        res.status(401);
        throw new Error('Not authorized to pay this challan');
    }

    challan.status = 'Paid';
    await challan.save();

    res.status(200).json(challan);
});

module.exports = {
    issueChallan,
    getOfficerChallans,
    getMyChallans,
    payChallan
};
