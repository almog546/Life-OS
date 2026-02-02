const express = require('express');
const router = express.Router();


const { createTimeLog, getTimeLogs,getTodayTimeLogs} = require('../controllers/timeLogController');
const requireAuth = require('../middlewares/requireAuth');

router.post('/', requireAuth, createTimeLog);
router.get('/', requireAuth, getTimeLogs);
router.get('/today', requireAuth, getTodayTimeLogs);

module.exports = router;