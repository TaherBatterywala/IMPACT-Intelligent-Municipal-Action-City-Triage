const mongoose = require('mongoose');

const officerSchema = new mongoose.Schema({
    officerId: {
        type: String,
        required: [true, 'Please add an Officer ID'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },                                                                              
    department: {
        type: String,
        required: [true, 'Please add a department'],
        enum: ['Water', 'Roads', 'Sanitation', 'Electricity', 'Health']
    },
    rank: {
        type: String,
        required: [true, 'Please add a rank'],
        enum: ['Junior', 'Senior', 'Head']
    },
    role: {
        type: String,
        default: 'officer'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Officer', officerSchema);
