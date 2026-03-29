const mongoose = require('mongoose');

const challanSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: [true, 'Please provide the offender\'s mobile number']
    },
    vehicleNumber: {
        type: String,
        required: [true, 'Please provide the vehicle number']
    },
    amount: {
        type: Number,
        required: [true, 'Please specify the fine amount']
    },
    reason: {
        type: String,
        required: [true, 'Please provide a reason for the challan']
    },
    status: {
        type: String, // 'Pending', 'Paid'
        default: 'Pending'
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Officer'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Challan', challanSchema);
