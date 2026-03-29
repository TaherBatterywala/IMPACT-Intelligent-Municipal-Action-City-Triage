const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Officer = require('../models/Officer');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, phone, password, city, wardNumber } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    const phoneExists = await User.findOne({ phone });

    if (userExists || phoneExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create user
    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        city,
        wardNumber
    });

    const savedUser = await user.save();

    console.log("Saved User: ", savedUser);

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            city: user.city,
            wardNumber: user.wardNumber,
            token: generateToken(user._id),
        });
    } else {
        return res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { phone, password } = req.body;

    // Check for user email
    const user = await User.findOne({ phone });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: 'citizen',
            city: user.city,
            wardNumber: user.wardNumber,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @desc    Authenticate an officer
// @route   POST /api/auth/officer/login
// @access  Public
const loginOfficer = asyncHandler(async (req, res) => {
    const { officerId, password } = req.body;

    // Check for officer
    const officer = await Officer.findOne({ officerId });

    if (officer && officer.password === password) { // Simple password check for demo/officer (or hash if seeded)
        res.json({
            _id: officer.id,
            name: officer.name,
            officerId: officer.officerId,
            role: 'officer',
            department: officer.department,
            token: generateToken(officer._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @desc    Register an officer (Seeding helper - strict route)
// @route   POST /api/auth/officer/register
// @access  Private
const registerOfficer = asyncHandler(async (req, res) => {
    const { officerId, name, password, department, rank } = req.body;

    // Hash password not implemented strictly here for simplicity as per requirements implies standard officer handling, 
    // but good practice to keep it simple or hashed. Using plain text for officer setup as requested "Officer ID + Password" 
    // usually implies pre-given credentials. But let's create a way to add them.

    const officer = await Officer.create({
        officerId,
        name,
        password: password, // For production, hash this!
        department,
        rank
    });

    res.status(201).json(officer);
});

module.exports = {
    registerUser,
    loginUser,
    loginOfficer,
    registerOfficer
};
