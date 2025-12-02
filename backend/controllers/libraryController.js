const { query } = require('../config/database');

// Get user's library with songs
const getUserLibrary = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user exists
    const userExists = await query(
      'SELECT * FROM "User" WHERE u_uid = $1',
      [userId]
    );
    
    if (userExists.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    // Get songs in user's library
    const result = await query(
      `SELECT s.*, sil.added_at, ar.ar_artistname, al.al_title as album_title
       FROM "song_in_library" sil
       JOIN "Song" s ON sil.s_sid = s.s_sid
       JOIN "Artist" ar ON s.s_artistid = ar.ar_artistid
       LEFT JOIN "Album" al ON s.s_albumid = al.al_albumid
       WHERE sil.u_uid = $1
       ORDER BY sil.added_at DESC`,
      [userId]
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting user library:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user library' 
    });
  }
};

// Get library stats
const getLibraryStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userExists = await query(
      'SELECT * FROM "User" WHERE u_uid = $1',
      [userId]
    );
    
    if (userExists.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    // Get all songs
    const totalSongs = await query(
      'SELECT COUNT(*) FROM "song_in_library" WHERE u_uid = $1',
      [userId]
    );
    
    // Get all artists
    const uniqueArtists = await query(
      `SELECT COUNT(DISTINCT s.s_artistid) 
       FROM "song_in_library" sil
       JOIN "Song" s ON sil.s_sid = s.s_sid
       WHERE sil.u_uid = $1`,
      [userId]
    );
    
    // Get all albums
    const uniqueAlbums = await query(
      `SELECT COUNT(DISTINCT s.s_albumid) 
       FROM "song_in_library" sil
       JOIN "Song" s ON sil.s_sid = s.s_sid
       WHERE sil.u_uid = $1 AND s.s_albumid IS NOT NULL`,
      [userId]
    );
    
    // Get total duration
    const totalDuration = await query(
      `SELECT SUM(EXTRACT(EPOCH FROM s.s_duration)) as total_seconds
       FROM "song_in_library" sil
       JOIN "Song" s ON sil.s_sid = s.s_sid
       WHERE sil.u_uid = $1`,
      [userId]
    );
    
    const stats = {
      totalSongs: parseInt(totalSongs.rows[0].count, 10),
      uniqueArtists: parseInt(uniqueArtists.rows[0].count, 10),
      uniqueAlbums: parseInt(uniqueAlbums.rows[0].count, 10),
      totalDuration: totalDuration.rows[0].total_seconds || 0
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting library stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch library stats' 
    });
  }
};

// Song in lib
const isSongInLibrary = async (req, res) => {
  try {
    const { userId, songId } = req.params;
    
    const result = await query(
      'SELECT * FROM "song_in_library" WHERE u_uid = $1 AND s_sid = $2',
      [userId, songId]
    );
    
    res.json({
      success: true,
      inLibrary: result.rows.length > 0
    });
  } catch (error) {
    console.error('Error checking song in library:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check song in library' 
    });
  }
};

// Add song to library
const addSongToLibrary = async (req, res) => {
  try {
    const { userId, songId } = req.params;
    
    // User Check
    const userExists = await query(
      'SELECT * FROM "User" WHERE u_uid = $1',
      [userId]
    );
    
    if (userExists.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    // Song Check
    const songExists = await query(
      'SELECT * FROM "Song" WHERE s_sid = $1',
      [songId]
    );
    
    if (songExists.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Song not found' 
      });
    }
    
    // Already in Lib
    const alreadyInLibrary = await query(
      'SELECT * FROM "song_in_library" WHERE u_uid = $1 AND s_sid = $2',
      [userId, songId]
    );
    
    if (alreadyInLibrary.rows.length > 0) {
      return res.status(409).json({ 
        success: false, 
        error: 'Song already in library' 
      });
    }
    
    // Add to library
    await query(
      'INSERT INTO "song_in_library" (u_uid, s_sid) VALUES ($1, $2)',
      [userId, songId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Song added to library successfully'
    });
  } catch (error) {
    console.error('Error adding song to library:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add song to library' 
    });
  }
};

// Remove song from library
const removeSongFromLibrary = async (req, res) => {
  try {
    const { userId, songId } = req.params;
    
    const result = await query(
      'DELETE FROM "song_in_library" WHERE u_uid = $1 AND s_sid = $2',
      [userId, songId]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Song not found in library' 
      });
    }
    
    res.json({
      success: true,
      message: 'Song removed from library successfully'
    });
  } catch (error) {
    console.error('Error removing song from library:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to remove song from library' 
    });
  }
};

const rateSongInLibrary = async (req, res) => {
  try {
    const { userId, songId } = req.params;
    const { rating } = req.body;

    // Validate rating (1-5)
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const result = await pool.query(
      'UPDATE Library SET l_rating = $1 WHERE l_uid = $2 AND l_sid = $3 RETURNING *',
      [rating, userId, songId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Song not found in library' });
    }

    res.json({ 
      success: true, 
      message: 'Rating updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Rate song error:', error);
    res.status(500).json({ error: 'Failed to rate song' });
  }
};

module.exports = {
  getUserLibrary,
  getLibraryStats,
  isSongInLibrary,
  addSongToLibrary,
  rateSongInLibrary,
  removeSongFromLibrary
};