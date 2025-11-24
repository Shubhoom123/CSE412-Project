const { query } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await query(
      'SELECT u_uid, u_username, u_email, created_at FROM "User" ORDER BY u_uid'
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch users' 
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT u_uid, u_username, u_email, created_at FROM "User" WHERE u_uid = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user' 
    });
  }
};

// Register new user
const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username, password, and email are required' 
      });
    }
    
    const existingUser = await query(
      'SELECT * FROM "User" WHERE u_username = $1 OR u_email = $2',
      [username, email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        success: false, 
        error: 'Username or email already exists' 
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await query(
      'INSERT INTO "User" (u_username, u_password, u_email) VALUES ($1, $2, $3) RETURNING u_uid, u_username, u_email, created_at',
      [username, hashedPassword, email]
    );
    
    await query(
      'INSERT INTO "Library" (u_uid) VALUES ($1)',
      [result.rows[0].u_uid]
    );
    
    const token = jwt.sign(
      { userId: result.rows[0].u_uid, username: result.rows[0].u_username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result.rows[0],
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to register user' 
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      });
    }
    
    const result = await query(
      'SELECT * FROM "User" WHERE u_username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      });
    }
    
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.u_password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      });
    }
    
    const token = jwt.sign(
      { userId: user.u_uid, username: user.u_username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        u_uid: user.u_uid,
        u_username: user.u_username,
        u_email: user.u_email
      },
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to login' 
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    
    const existingUser = await query(
      'SELECT * FROM "User" WHERE u_uid = $1',
      [id]
    );
    
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    const result = await query(
      'UPDATE "User" SET u_email = $1 WHERE u_uid = $2 RETURNING u_uid, u_username, u_email, created_at',
      [email, id]
    );
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update user' 
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingUser = await query(
      'SELECT * FROM "User" WHERE u_uid = $1',
      [id]
    );
    
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    await query('DELETE FROM "User" WHERE u_uid = $1', [id]);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete user' 
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  updateUser,
  deleteUser
};
