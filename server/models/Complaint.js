const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Water', 'Roads', 'Sanitation', 'Electricity', 'Health']
    },
    subCategory: {
        type: String,
        required: [true, 'Please select a sub-category']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    location: {
        type: String,
        required: [true, 'Please add a location (Ward/Area)']
    },
    image: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    messages: [{
        sender: { type: String, required: true },
        text: { type: String, required: true },
        time: { type: Date, default: Date.now }
    }],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Officer'
    },
    assignedOfficerName: { type: String, default: "" },
    aiCategory: { type: String, default: "" },
    aiSeverity: { type: String, default: "" },
    aiDetections: { type: Array, default: [] }
}, {
    timestamps: true
});

// Compound indexes for the two most common query patterns:
// 1. Citizen: find by userId, sorted by newest first
complaintSchema.index({ userId: 1, createdAt: -1 });
// 2. Officer: find by department category, sorted by newest first
complaintSchema.index({ category: 1, createdAt: -1 });
// 3. Status filtering used alongside both above
complaintSchema.index({ status: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
