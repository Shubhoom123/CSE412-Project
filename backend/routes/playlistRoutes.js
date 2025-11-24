const express = require('express');
const router = express.Router();
const { 
  getUserPlaylists, 
  getPlaylistById, 
  createPlaylist, 
  updatePlaylist, 
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  reorderPlaylist
} = require('../controllers/playlistController');
const { authenticateToken } = require('../middleware/auth');

router.get('/user/:userId', authenticateToken, getUserPlaylists);
router.get('/:id', authenticateToken, getPlaylistById);
router.post('/', authenticateToken, createPlaylist);
router.put('/:id', authenticateToken, updatePlaylist);
router.delete('/:id', authenticateToken, deletePlaylist);
router.post('/:playlistId/songs/:songId', authenticateToken, addSongToPlaylist);
router.delete('/:playlistId/songs/:songId', authenticateToken, removeSongFromPlaylist);
router.put('/:playlistId/reorder', authenticateToken, reorderPlaylist);

module.exports = router;
