const express = require('express');
const router = express.Router();
const { 
  getUserLibrary, 
  addSongToLibrary, 
  removeSongFromLibrary,
  isSongInLibrary,
  getLibraryStats
} = require('../controllers/libraryController');
const { authenticateToken } = require('../middleware/auth');

router.get('/:userId', authenticateToken, getUserLibrary);
router.get('/:userId/stats', authenticateToken, getLibraryStats);
router.get('/:userId/songs/:songId', authenticateToken, isSongInLibrary);
router.post('/:userId/songs/:songId', authenticateToken, addSongToLibrary);
router.delete('/:userId/songs/:songId', authenticateToken, removeSongFromLibrary);

module.exports = router;
