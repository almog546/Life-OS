const express = require('express');
const router = express.Router();


const { createTimeLog, getTimeLogs,getTodayTimeLogs,getweekTimeLogs,getMonthTimeLogs,getYearTimeLogs,updateTimeLog,deleteTimeLog,updateareaid} = require('../controllers/timeLogController');
const requireAuth = require('../middlewares/requireAuth');

router.post('/', requireAuth, createTimeLog);
router.get('/', requireAuth, getTimeLogs);
router.get('/today', requireAuth, getTodayTimeLogs);
router.put('/:id/transfer', requireAuth, updateareaid);
router.put('/:id', requireAuth, updateTimeLog);
router.delete('/:id', requireAuth, deleteTimeLog);
router.get('/week', requireAuth, getweekTimeLogs);
router.get('/month', requireAuth, getMonthTimeLogs);
router.get('/year', requireAuth, getYearTimeLogs);

module.exports = router;