const express = require('express');
const router = express.Router();

const { createArea, getAreas,editArea,deleteArea } = require('../controllers/areaController');
const requireAuth = require('../middlewares/requireAuth');

router.post('/', requireAuth, createArea);
router.get('/', requireAuth, getAreas);
router.put('/:id', requireAuth, editArea);
router.delete('/:id', requireAuth, deleteArea);
module.exports = router;
 