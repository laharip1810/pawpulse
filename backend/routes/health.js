const express = require('express');
const router = express.Router();
const { checkSymptoms, getHealthHistory } = require('../controllers/healthController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/check', checkSymptoms);
router.get('/:petId', getHealthHistory);

module.exports = router;
