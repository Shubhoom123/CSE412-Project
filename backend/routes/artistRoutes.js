const express = require('express');
const router = express.Router();
const { 
  getAllArtists, 
  getArtistById, 
  createArtist, 
  updateArtist, 
  deleteArtist,
  searchArtists
} = require('../controllers/artistController');
const { authenticateToken } = require('../middleware/auth');

router.get('/search', authenticateToken, searchArtists);
router.get('/', authenticateToken, getAllArtists);
router.get('/:id', authenticateToken, getArtistById);
router.post('/', authenticateToken, createArtist);
router.put('/:id', authenticateToken, updateArtist);
router.delete('/:id', authenticateToken, deleteArtist);

module.exports = router;
