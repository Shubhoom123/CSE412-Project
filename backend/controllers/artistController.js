const { query } = require('../config/database');

// Get all artists
const getAllArtists = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM "Artist" ORDER BY ar_artistname'
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting artists:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch artists' 
    });
  }
};

// Get artist by ID with albums and songs
const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const artistResult = await query(
      'SELECT * FROM "Artist" WHERE ar_artistid = $1',
      [id]
    );
    
    if (artistResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Artist not found' 
      });
    }
    
    const albumsResult = await query(
      'SELECT * FROM "Album" WHERE al_artistid = $1 ORDER BY al_release_date DESC',
      [id]
    );
    
    const songsResult = await query(
      'SELECT * FROM "Song" WHERE s_artistid = $1 ORDER BY s_track_number',
      [id]
    );
    
    res.json({
      success: true,
      data: {
        artist: artistResult.rows[0],
        albums: albumsResult.rows,
        songs: songsResult.rows
      }
    });
  } catch (error) {
    console.error('Error getting artist:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch artist' 
    });
  }
};

// Create new artist
const createArtist = async (req, res) => {
  try {
    const { artistname, biography, country, birth_year, death_year } = req.body;
    
    if (!artistname) {
      return res.status(400).json({ 
        success: false, 
        error: 'Artist name is required' 
      });
    }
    
    const result = await query(
      `INSERT INTO "Artist" (ar_artistname, ar_biography, ar_country, ar_birth_year, ar_death_year) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [artistname, biography, country, birth_year, death_year]
    );
    
    res.status(201).json({
      success: true,
      message: 'Artist created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create artist' 
    });
  }
};

// Update artist
const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { artistname, biography, country, birth_year, death_year } = req.body;
    
    const existingArtist = await query(
      'SELECT * FROM "Artist" WHERE ar_artistid = $1',
      [id]
    );
    
    if (existingArtist.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Artist not found' 
      });
    }
    
    const result = await query(
      `UPDATE "Artist" 
       SET ar_artistname = COALESCE($1, ar_artistname),
           ar_biography = COALESCE($2, ar_biography),
           ar_country = COALESCE($3, ar_country),
           ar_birth_year = COALESCE($4, ar_birth_year),
           ar_death_year = COALESCE($5, ar_death_year)
       WHERE ar_artistid = $6
       RETURNING *`,
      [artistname, biography, country, birth_year, death_year, id]
    );
    
    res.json({
      success: true,
      message: 'Artist updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update artist' 
    });
  }
};

// Delete artist
const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingArtist = await query(
      'SELECT * FROM "Artist" WHERE ar_artistid = $1',
      [id]
    );
    
    if (existingArtist.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Artist not found' 
      });
    }
    
    await query('DELETE FROM "Artist" WHERE ar_artistid = $1', [id]);
    
    res.json({
      success: true,
      message: 'Artist deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete artist' 
    });
  }
};

// Search artists by name
const searchArtists = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search term is required' 
      });
    }
    
    const result = await query(
      'SELECT * FROM "Artist" WHERE ar_artistname ILIKE $1 ORDER BY ar_artistname',
      [`%${name}%`]
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error searching artists:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search artists' 
    });
  }
};

module.exports = {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
  searchArtists
};