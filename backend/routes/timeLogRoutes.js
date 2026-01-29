const express = require('express');
const router = express.Router();


const { createTimeLog, getTimeLogs} = require('../controllers/timeLogController');
const requireAuth = require('../middlewares/requireAuth');

router.post('/', requireAuth, createTimeLog);
router.get('/', requireAuth, getTimeLogs);

module.exports = router;