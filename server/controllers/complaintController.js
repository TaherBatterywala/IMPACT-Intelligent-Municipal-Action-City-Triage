const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');

// @desc    Get user complaints
// @route   GET /api/complaints/my
// @access  Private (User)
const getMyComplaints = asyncHandler(async (req, res) => {
    console.log("--- DEBUG GET COMPLAINTS ---");
    console.log("User token payload user ID:", req.user ? req.user._id : "Missing req.user");
    
    // LIMIT added to prevent massive database payloads crashing the frontend
    const complaints = await Complaint.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(100);
    console.log("Found Complaints Array Length:", complaints.length);
    
    res.status(200).json(complaints);
});

// @desc    Get officer complaints (by department)
// @route   GET /api/complaints/officer
// @access  Private (Officer)
const getOfficerComplaints = asyncHandler(async (req, res) => {
    // Assuming officer is attached to req.user and has department
    if (!req.user.department) {
        res.status(400);
        throw new Error('Officer department not found');
    }

    // Fetch complaints match officer department, limited to 100 to prevent severe UI lag
    const complaints = await Complaint.find({ category: req.user.department })
        .populate('userId', 'name email phone city wardNumber')
        .sort({ createdAt: -1 })
        .limit(100);
    res.status(200).json(complaints);
});

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (User)
const createComplaint = asyncHandler(async (req, res) => {
    const { category, subCategory, description, location, image } = req.body;

    if (!category || !subCategory || !description || !location) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    let aiCategory = "";
    let aiSeverity = "";
    let aiDetections = [];

    try {
        const textResponse = await fetch('http://127.0.0.1:8000/api/ml/analyze-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: description })
        });
        if (textResponse.ok) {
            const textData = await textResponse.json();
            aiCategory = textData.category || "";
            aiSeverity = textData.severity || "";
        }

        if (image) {
            const imgResponse = await fetch('http://127.0.0.1:8000/api/ml/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: image })
            });
            if (imgResponse.ok) {
                const imgData = await imgResponse.json();
                aiDetections = imgData.detections || [];
            }
        }
    } catch (error) {
        console.error("ML Integration Error:", error.message);
    }

    const complaint = await Complaint.create({
        userId: req.user.id,
        category,
        subCategory,
        description,
        location,
        image,
        aiCategory,
        aiSeverity,
        aiDetections
    });
 
    res.status(201).json({ msg: "Complaint Created Succesfully", complaint: complaint });
});

// @desc    Update complaint status (Assign, Resolve)
// @route   PUT /api/complaints/:id
// @access  Private (Officer)
const updateComplaint = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
        res.status(404);
        throw new Error('Complaint not found');
    }

    // Check if officer allows
    if (!req.user.role === 'officer') {
        res.status(401);
        throw new Error('Not authorized');
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedComplaint);
});

module.exports = {
    getMyComplaints,
    getOfficerComplaints,
    createComplaint,
    updateComplaint
};
