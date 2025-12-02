const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  registerUser,
  loginUser
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// AUTH ROUTES
router.post('/register', registerUser);
router.post('/login', loginUser);

// USER ROUTES
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
