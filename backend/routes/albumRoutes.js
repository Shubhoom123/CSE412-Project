const express = require('express');
const router = express.Router();
const { 
  getAllAlbums, 
  getAlbumById, 
  createAlbum, 
  updateAlbum, 
  deleteAlbum,
  getAlbumsByArtist
} = require('../controllers/albumController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getAllAlbums);
router.get('/:id', authenticateToken, getAlbumById);
router.get('/artist/:artistId', authenticateToken, getAlbumsByArtist);
router.post('/', authenticateToken, createAlbum);
router.put('/:id', authenticateToken, updateAlbum);
router.delete('/:id', authenticateToken, deleteAlbum);

module.exports = router;
