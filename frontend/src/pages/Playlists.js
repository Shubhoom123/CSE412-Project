import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { musicAPI } from '../services/api';
import { FaList, FaPlus, FaTrash, FaEdit, FaMusic, FaTimes } from 'react-icons/fa';
import './Playlists.css';

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await musicAPI.getPlaylists(user.u_uid);
      setPlaylists(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setLoading(false);
    }
  };

  const viewPlaylist = async (playlistId) => {
    try {
      const response = await musicAPI.getPlaylistById(playlistId);
      setSelectedPlaylist(response.data.data.playlist);
      setPlaylistSongs(response.data.data.songs);
    } catch (error) {
      console.error('Error fetching playlist:', error);
      alert('Failed to load playlist');
    }
  };

  const deletePlaylist = async (playlistId) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;

    try {
      await musicAPI.deletePlaylist(playlistId);
      setPlaylists(playlists.filter(p => p.p_pid !== playlistId));
      if (selectedPlaylist?.p_pid === playlistId) {
        setSelectedPlaylist(null);
        setPlaylistSongs([]);
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      alert('Failed to delete playlist');
    }
  };

  const removeSongFromPlaylist = async (playlistId, songId) => {
    if (!window.confirm('Remove this song from the playlist?')) return;

    try {
      await musicAPI.removeSongFromPlaylist(playlistId, songId);
      setPlaylistSongs(playlistSongs.filter(s => s.s_sid !== songId));
    } catch (error) {
      console.error('Error removing song:', error);
      alert('Failed to remove song');
    }
  };

  if (loading) {
    return (
      <div className="playlists-container">
        <div className="loading-state">
          <div className="spinner-lg"></div>
          <p>Loading your playlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="playlists-container">
      {/* Header */}
      <div className="playlists-header">
        <div>
          <h1 className="playlists-title">My Playlists</h1>
          <p className="playlists-subtitle">{playlists.length} playlists</p>
        </div>
        <button
          className="create-playlist-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus /> Create Playlist
        </button>
      </div>

      {/* Content */}
      <div className="playlists-content">
        {/* Playlists List */}
        <div className="playlists-list">
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <div
                key={playlist.p_pid}
                className={`playlist-item ${selectedPlaylist?.p_pid === playlist.p_pid ? 'active' : ''}`}
                onClick={() => viewPlaylist(playlist.p_pid)}
              >
                <div className="playlist-icon">
                  <FaList />
                </div>
                <div className="playlist-info">
                  <h3 className="playlist-name">{playlist.p_title}</h3>
                  <p className="playlist-desc">
                    {playlist.p_description || 'No description'}
                  </p>
                </div>
                <div className="playlist-actions">
                  <button
                    className="action-icon-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(playlist.p_pid);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <FaList className="empty-icon" />
              <p className="empty-text">No playlists yet</p>
              <button
                className="btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                <FaPlus /> Create Your First Playlist
              </button>
            </div>
          )}
        </div>

        {/* Playlist Details */}
        {selectedPlaylist && (
          <div className="playlist-details">
            <div className="details-header">
              <div className="details-cover">
                <FaList />
              </div>
              <div className="details-info">
                <h2 className="details-title">{selectedPlaylist.p_title}</h2>
                <p className="details-desc">
                  {selectedPlaylist.p_description || 'No description'}
                </p>
                <p className="details-meta">
                  {playlistSongs.length} songs • Created {new Date(selectedPlaylist.p_creation_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Songs in Playlist */}
            <div className="playlist-songs">
              {playlistSongs.length > 0 ? (
                playlistSongs.map((song, index) => (
                  <div key={song.s_sid} className="playlist-song-item">
                    <div className="song-number">{index + 1}</div>
                    <div className="song-thumbnail">
                      <FaMusic />
                    </div>
                    <div className="song-info">
                      <p className="song-title">{song.s_title}</p>
                      <p className="song-artist">{song.ar_artistname}</p>
                    </div>
                    {song.album_title && (
                      <div className="song-album">{song.album_title}</div>
                    )}
                    <button
                      className="remove-song-btn"
                      onClick={() => removeSongFromPlaylist(selectedPlaylist.p_pid, song.s_sid)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-playlist">
                  <FaMusic className="empty-icon" />
                  <p>This playlist is empty</p>
                  <p className="text-sm text-gray-400">Add songs from your library or browse</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedPlaylist && playlists.length > 0 && (
          <div className="no-selection">
            <FaList className="empty-icon" />
            <p>Select a playlist to view details</p>
          </div>
        )}
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <CreatePlaylistModal
          userId={user.u_uid}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newPlaylist) => {
            setPlaylists([newPlaylist, ...playlists]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

// Create Playlist Modal Component
const CreatePlaylistModal = ({ userId, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Playlist title is required');
      return;
    }

    setLoading(true);

    try {
      const response = await musicAPI.createPlaylist({
        userId,
        title: title.trim(),
        description: description.trim()
      });
      onSuccess(response.data.data);
    } catch (error) {
      console.error('Error creating playlist:', error);
      setError(error.response?.data?.error || 'Failed to create playlist');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Playlist</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Playlist Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="My Awesome Playlist"
              disabled={loading}
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="What's this playlist about?"
              rows={4}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              <p className="error-text">{error}</p>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus /> Create Playlist
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Playlists;