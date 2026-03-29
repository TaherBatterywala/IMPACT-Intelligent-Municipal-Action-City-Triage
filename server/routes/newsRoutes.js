const express = require('express');
const router = express.Router();
const { getNewsByCity } = require('../controllers/newsController');

router.get('/:city', getNewsByCity);

module.exports = router;
