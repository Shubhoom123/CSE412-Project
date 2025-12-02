const { query } = require('../config/database');

// Get albums
const getAllAlbums = async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, ar.ar_artistname 
       FROM "Album" a
       JOIN "Artist" ar ON a.al_artistid = ar.ar_artistid
       ORDER BY a.al_release_date DESC`
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting albums:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get albums' 
    });
  }
};

// Get album by ID
const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const albumResult = await query(
      `SELECT a.*, ar.ar_artistname 
       FROM "Album" a
       JOIN "Artist" ar ON a.al_artistid = ar.ar_artistid
       WHERE a.al_albumid = $1`,
      [id]
    );
    
    if (albumResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Album not found' 
      });
    }
    
    const songsResult = await query(
      'SELECT * FROM "Song" WHERE s_albumid = $1 ORDER BY s_track_number',
      [id]
    );
    
    res.json({
      success: true,
      data: {
        album: albumResult.rows[0],
        songs: songsResult.rows
      }
    });
  } catch (error) {
    console.error('Error getting album:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get album' 
    });
  }
};

// Create new album
const createAlbum = async (req, res) => {
  try {
    const { artistid, title, release_date, album_art } = req.body;
    
    if (!artistid || !title) {
      return res.status(400).json({ 
        success: false, 
        error: 'Artist ID and title required' 
      });
    }
    
    const result = await query(
      `INSERT INTO "Album" (al_artistid, al_title, al_release_date, al_album_art) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [artistid, title, release_date, album_art || 'default.png']
    );
    
    res.status(201).json({
      success: true,
      message: 'Album created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create album' 
    });
  }
};

// Update album
const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, release_date, album_art } = req.body;
    
    const existingAlbum = await query(
      'SELECT * FROM "Album" WHERE al_albumid = $1',
      [id]
    );
    
    if (existingAlbum.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Album not found' 
      });
    }
    
    const result = await query(
      `UPDATE "Album" 
       SET al_title = COALESCE($1, al_title),
           al_release_date = COALESCE($2, al_release_date),
           al_album_art = COALESCE($3, al_album_art)
       WHERE al_albumid = $4
       RETURNING *`,
      [title, release_date, album_art, id]
    );
    
    res.json({
      success: true,
      message: 'Album updated',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating album:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update album' 
    });
  }
};

// Delete album
const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingAlbum = await query(
      'SELECT * FROM "Album" WHERE al_albumid = $1',
      [id]
    );
    
    if (existingAlbum.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Album not found' 
      });
    }
    
    await query('DELETE FROM "Album" WHERE al_albumid = $1', [id]);
    
    res.json({
      success: true,
      message: 'Album deleted'
    });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete album' 
    });
  }
};

// Get albums by artist
const getAlbumsByArtist = async (req, res) => {
  try {
    const { artistId } = req.params;
    
    const result = await query(
      'SELECT * FROM "Album" WHERE al_artistid = $1 ORDER BY al_release_date DESC',
      [artistId]
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting albums by artist:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get albums' 
    });
  }
};

module.exports = {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getAlbumsByArtist
};