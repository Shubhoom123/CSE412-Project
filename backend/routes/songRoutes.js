const express = require('express');
const router = express.Router();
const { 
  getAllSongs, 
  getSongById, 
  createSong, 
  updateSong, 
  deleteSong,
  searchSongs,
  getSongsByGenre
} = require('../controllers/songController');
const { authenticateToken } = require('../middleware/auth');

router.get('/search', authenticateToken, searchSongs);
router.get('/genre/:genre', authenticateToken, getSongsByGenre);
router.get('/', authenticateToken, getAllSongs);
router.get('/:id', authenticateToken, getSongById);
router.post('/', authenticateToken, createSong);
router.put('/:id', authenticateToken, updateSong);
router.delete('/:id', authenticateToken, deleteSong);

module.exports = router;
