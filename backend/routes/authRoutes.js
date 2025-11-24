const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error logging out' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  });
});

router.get('/status', (req, res) => {
  res.json({
    success: true,
    authenticated: req.isAuthenticated(),
    user: req.user || null
  });
});

module.exports = router;
