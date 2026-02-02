const express = require('express');
const router = express.Router();


const { createTimeLog, getTimeLogs,getTodayTimeLogs,getweekTimeLogs,getMonthTimeLogs,getYearTimeLogs} = require('../controllers/timeLogController');
const requireAuth = require('../middlewares/requireAuth');

router.post('/', requireAuth, createTimeLog);
router.get('/', requireAuth, getTimeLogs);
router.get('/today', requireAuth, getTodayTimeLogs);
router.get('/week', requireAuth, getweekTimeLogs);
router.get('/month', requireAuth, getMonthTimeLogs);
router.get('/year', requireAuth, getYearTimeLogs);

module.exports = router;