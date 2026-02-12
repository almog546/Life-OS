const express = require('express');
const router = express.Router();

const { signup, login, me, logout } = require('../controllers/authController');



router.post('/signup', signup);
router.post('/login', login);
router.get('/me', me);
router.post('/logout', logout);
router.post('/demo-login', (req, res) => {
  req.session.userId = 6; 
  res.json({ success: true });
});

module.exports = router;