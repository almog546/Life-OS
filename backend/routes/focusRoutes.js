const express = require('express');
const router = express.Router();

const { createFocus, deleteFocus, getFocus} = require('../controllers/focusController');
const requireAuth = require('../middlewares/requireAuth');

router.post('/', requireAuth, createFocus);
router.delete('/:id', requireAuth, deleteFocus);
router.get('/', requireAuth, getFocus);
module.exports = router;