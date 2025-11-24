const { query } = require('../config/database');

// Get all songs
const getAllSongs = async (req, res) => {
  try {
    const result = await query(
      `SELECT s.*, ar.ar_artistname, al.al_title as album_title
       FROM "Song" s
       JOIN "Artist" ar ON s.s_artistid = ar.ar_artistid
       LEFT JOIN "Album" al ON s.s_albumid = al.al_albumid
       ORDER BY s.s_title`
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting songs:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch songs' 
    });
  }
};

// Get song by ID
const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `SELECT s.*, ar.ar_artistname, al.al_title as album_title
       FROM "Song" s
       JOIN "Artist" ar ON s.s_artistid = ar.ar_artistid
       LEFT JOIN "Album" al ON s.s_albumid = al.al_albumid
       WHERE s.s_sid = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Song not found' 
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error getting song:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch song' 
    });
  }
};

// Create new song
const createSong = async (req, res) => {
  try {
    const { artistid, albumid, title, duration, genre, release_date, track_number, rating } = req.body;
    
    if (!artistid || !title || !duration) {
      return res.status(400).json({ 
        success: false, 
        error: 'Artist ID, title, and duration are required' 
      });
    }
    
    const result = await query(
      `INSERT INTO "Song" (s_artistid, s_albumid, s_title, s_duration, s_genre, s_release_date, s_track_number, s_rating) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [artistid, albumid, title, duration, genre, release_date, track_number, rating || 0]
    );
    
    res.status(201).json({
      success: true,
      message: 'Song created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating song:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create song' 
    });
  }
};

// Update song
const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, duration, genre, track_number, rating } = req.body;
    
    const existingSong = await query(
      'SELECT * FROM "Song" WHERE s_sid = $1',
      [id]
    );
    
    if (existingSong.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Song not found' 
      });
    }
    
    const result = await query(
      `UPDATE "Song" 
       SET s_title = COALESCE($1, s_title),
           s_duration = COALESCE($2, s_duration),
           s_genre = COALESCE($3, s_genre),
           s_track_number = COALESCE($4, s_track_number),
           s_rating = COALESCE($5, s_rating)
       WHERE s_sid = $6
       RETURNING *`,
      [title, duration, genre, track_number, rating, id]
    );
    
    res.json({
      success: true,
      message: 'Song updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating song:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update song' 
    });
  }
};

// Delete song
const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingSong = await query(
      'SELECT * FROM "Song" WHERE s_sid = $1',
      [id]
    );
    
    if (existingSong.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Song not found' 
      });
    }
    
    await query('DELETE FROM "Song" WHERE s_sid = $1', [id]);
    
    res.json({
      success: true,
      message: 'Song deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete song' 
    });
  }
};

// Search songs
const searchSongs = async (req, res) => {
  try {
    const { title, genre, artist } = req.query;
    
    let queryText = `
      SELECT s.*, ar.ar_artistname, al.al_title as album_title
      FROM "Song" s
      JOIN "Artist" ar ON s.s_artistid = ar.ar_artistid
      LEFT JOIN "Album" al ON s.s_albumid = al.al_albumid
      WHERE 1=1
    `;
    const queryParams = [];
    let paramCount = 1;
    
    if (title) {
      queryText += ` AND s.s_title ILIKE $${paramCount}`;
      queryParams.push(`%${title}%`);
      paramCount++;
    }
    
    if (genre) {
      queryText += ` AND s.s_genre ILIKE $${paramCount}`;
      queryParams.push(`%${genre}%`);
      paramCount++;
    }
    
    if (artist) {
      queryText += ` AND ar.ar_artistname ILIKE $${paramCount}`;
      queryParams.push(`%${artist}%`);
      paramCount++;
    }
    
    queryText += ' ORDER BY s.s_title';
    
    const result = await query(queryText, queryParams);
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error searching songs:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search songs' 
    });
  }
};

// Get songs by genre
const getSongsByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    
    const result = await query(
      `SELECT s.*, ar.ar_artistname, al.al_title as album_title
       FROM "Song" s
       JOIN "Artist" ar ON s.s_artistid = ar.ar_artistid
       LEFT JOIN "Album" al ON s.s_albumid = al.al_albumid
       WHERE s.s_genre ILIKE $1
       ORDER BY s.s_rating DESC`,
      [`%${genre}%`]
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting songs by genre:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch songs' 
    });
  }
};

module.exports = {
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  searchSongs,
  getSongsByGenre
};
