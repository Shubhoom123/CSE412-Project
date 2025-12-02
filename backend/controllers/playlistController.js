const { query } = require('../config/database');

// ==============================
// GET ALL PLAYLISTS FOR USER
// ==============================
const getUserPlaylists = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await query(
      `SELECT * FROM "Playlist" 
       WHERE p_uid = $1 
       ORDER BY p_creation_date DESC`,
      [userId]
    );

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error("getUserPlaylists ERROR:", error);
    res.status(500).json({ success: false, error: "Failed to fetch playlists" });
  }
};

// ==============================
// GET PLAYLIST BY ID + SONGS
// ==============================
const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;

    const playlistResult = await query(
      `SELECT * FROM "Playlist" WHERE p_pid = $1`,
      [id]
    );

    if (playlistResult.rows.length === 0)
      return res.status(404).json({ success: false, error: "Playlist not found" });

    const songsResult = await query(
      `SELECT s.*, sp.position, ar.ar_artistname, al.al_title AS album_title
       FROM "song_in_playlist" sp
       JOIN "Song" s ON sp.s_sid = s.s_sid
       JOIN "Artist" ar ON s.s_artistid = ar.ar_artistid
       LEFT JOIN "Album" al ON s.s_albumid = al.al_albumid
       WHERE sp.p_pid = $1
       ORDER BY sp.position ASC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        playlist: playlistResult.rows[0],
        songs: songsResult.rows
      }
    });
  } catch (error) {
    console.error("getPlaylistById ERROR:", error);
    res.status(500).json({ success: false, error: "Failed to fetch playlist" });
  }
};

// ==============================
// CREATE PLAYLIST
// ==============================
const createPlaylist = async (req, res) => {
  try {
    const { userId, title, description } = req.body;

    if (!userId || !title)
      return res.status(400).json({ success: false, error: "User ID and title required" });

    const result = await query(
      `INSERT INTO "Playlist" (p_uid, p_title, p_description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, title, description]
    );

    res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("createPlaylist ERROR:", error);
    res.status(500).json({ success: false, error: "Failed to create playlist" });
  }
};

// ==============================
// UPDATE PLAYLIST (RENAME)
// ==============================
const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const exists = await query(
      `SELECT * FROM "Playlist" WHERE p_pid = $1`,
      [id]
    );

    if (exists.rows.length === 0)
      return res.status(404).json({ success: false, error: "Playlist not found" });

    const updated = await query(
      `UPDATE "Playlist"
       SET p_title = COALESCE($1, p_title),
           p_description = COALESCE($2, p_description)
       WHERE p_pid = $3
       RETURNING *`,
      [title, description, id]
    );

    res.json({
      success: true,
      message: "Playlist updated successfully",
      data: updated.rows[0]
    });
  } catch (error) {
    console.error("updatePlaylist ERROR:", error);
    res.status(500).json({ success: false, error: "Failed to update playlist" });
  }
};

// ==============================
// DELETE PLAYLIST
// ==============================
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await query(
      `SELECT * FROM "Playlist" WHERE p_pid = $1`,
      [id]
    );

    if (exists.rows.length === 0)
      return res.status(404).json({ success: false, error: "Playlist not found" });

    await query(`DELETE FROM "Playlist" WHERE p_pid = $1`, [id]);

    res.json({ success: true, message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("deletePlaylist ERROR:", error);
    res.status(500).json({ success: false, error: "Failed to delete playlist" });
  }
};

// ==============================
// ADD SONG TO PLAYLIST
// ==============================
const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;

    // Check duplicates
    const existing = await query(
      `SELECT * FROM "song_in_playlist" WHERE p_pid = $1 AND s_sid = $2`,
      [playlistId, songId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Song already in playlist"
      });
    }

    await query(
      `INSERT INTO "song_in_playlist" (p_pid, s_sid, position)
       VALUES ($1, $2, 
        (SELECT COALESCE(MAX(position), 0) + 1 FROM "song_in_playlist" WHERE p_pid = $1)
       )`,
      [playlistId, songId]
    );

    res.json({ success: true, message: "Song added to playlist" });
  } catch (error) {
    console.error("addSongToPlaylist ERROR:", error);
    res.status(500).json({ success: false, error: "Failed to add song" });
  }
};

// ==============================
// REMOVE SONG FROM PLAYLIST
// ==============================
const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;

    const deleted = await query(
      `DELETE FROM "song_in_playlist"
       WHERE p_pid = $1 AND s_sid = $2`,
      [playlistId, songId]
    );

    if (deleted.rowCount === 0)
      return res.status(404).json({ success: false, error: "Song not found" });

    res.json({ success: true, message: "Song removed" });
  } catch (error) {
    console.error("removeSongFromPlaylist ERROR:", error);
    res.status(500).json({ success: false, error: "Failed to remove song" });
  }
};

// ==============================
// REORDER PLAYLIST
// ==============================
const reorderPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { songPositions } = req.body; // [{ songId, position }]

    for (const item of songPositions) {
      await query(
        `UPDATE "song_in_playlist"
         SET position = $1
         WHERE p_pid = $2 AND s_sid = $3`,
        [item.position, playlistId, item.songId]
      );
    }

    res.json({ success: true, message: "Playlist reordered" });
  } catch (error) {
    console.error("reorderPlaylist ERROR:", error);
    res.status(500).json({ success: false, error: "Failed to reorder playlist" });
  }
};

module.exports = {
  getUserPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  reorderPlaylist
};
