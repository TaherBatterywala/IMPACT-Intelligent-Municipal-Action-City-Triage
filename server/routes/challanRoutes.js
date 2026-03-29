const express = require('express');
const router = express.Router();
const { 
    issueChallan, 
    getOfficerChallans, 
    getMyChallans, 
    payChallan 
} = require('../controllers/challanController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// User Routes
router.get('/my', protect, getMyChallans);
router.put('/:id/pay', protect, payChallan);

// Officer Routes
router.post('/', protect, authorize('officer'), issueChallan);
router.get('/officer', protect, authorize('officer'), getOfficerChallans);

module.exports = router;
