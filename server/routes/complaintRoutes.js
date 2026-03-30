const express = require('express');
const router = express.Router();
const { getMyComplaints, getOfficerComplaints, createComplaint, getComplaintById, updateComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
    .post(protect, createComplaint);

router.route('/my')
    .get(protect, getMyComplaints);

router.route('/officer')
    .get(protect, authorize('officer'), getOfficerComplaints);

router.route('/:id')
    .get(protect, getComplaintById)       // Full detail including image
    .put(protect, authorize('officer'), updateComplaint);

module.exports = router;
