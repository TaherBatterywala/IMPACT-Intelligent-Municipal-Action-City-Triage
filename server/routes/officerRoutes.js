const express = require('express');
const router = express.Router();
const { getStats, assignComplaint, resolveComplaint, messageUser } = require('../controllers/officerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('officer'));

router.get('/stats', getStats);
router.put('/assign/:id', assignComplaint);
router.put('/resolve/:id', resolveComplaint);
router.post('/message/:id', messageUser);

module.exports = router;
