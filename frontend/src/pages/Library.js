import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { musicAPI } from '../services/api';
import { FaMusic, FaPlay, FaTrash, FaSearch, FaSort } from 'react-icons/fa';
import './Library.css';

const Library = () => {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchLibrary();
  }, []);

  useEffect(() => {
    filterAndSortSongs();
  }, [searchTerm, sortBy, songs]);

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const response = await musicAPI.getLibrary(user.u_uid);
      setSongs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching library:', error);
      setLoading(false);
    }
  };

  const filterAndSortSongs = () => {
    let filtered = [...songs];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(song =>
        song.s_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.ar_artistname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (song.album_title && song.album_title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    switch (sortBy) {
      case 'title':
        filtered.sort((a, b) => a.s_title.localeCompare(b.s_title));
        break;
      case 'artist':
        filtered.sort((a, b) => a.ar_artistname.localeCompare(b.ar_artistname));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.added_at) - new Date(a.added_at));
    }

    setFilteredSongs(filtered);
  };

  const removeSong = async (songId) => {
    if (!window.confirm('Remove this song from your library?')) return;

    try {
      await musicAPI.removeSongFromLibrary(user.u_uid, songId);
      setSongs(songs.filter(song => song.s_sid !== songId));
    } catch (error) {
      console.error('Error removing song:', error);
      alert('Failed to remove song');
    }
  };

  if (loading) {
    return (
      <div className="library-container">
        <div className="loading-state">
          <div className="spinner-lg"></div>
          <p>Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="library-container">
      {/* Header */}
      <div className="library-header">
        <h1 className="library-title">My Library</h1>
        <p className="library-subtitle">{songs.length} songs in your collection</p>
      </div>

      {/* Controls */}
      <div className="library-controls">
        {/* Search */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Sort */}
        <div className="sort-dropdown">
          <FaSort className="sort-icon" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Recently Added</option>
            <option value="title">Song Title</option>
            <option value="artist">Artist Name</option>
          </select>
        </div>
      </div>

      {/* Songs List */}
      {filteredSongs.length > 0 ? (
        <div className="songs-grid">
          {filteredSongs.map((song) => (
            <div key={song.s_sid} className="song-card">
              <div className="song-card-thumbnail">
                <FaMusic />
              </div>
              <div className="song-card-info">
                <h3 className="song-card-title">{song.s_title}</h3>
                <p className="song-card-artist">{song.ar_artistname}</p>
                {song.album_title && (
                  <p className="song-card-album">{song.album_title}</p>
                )}
                <p className="song-card-meta">
                  {song.s_genre && <span className="genre-tag">{song.s_genre}</span>}
                  {song.s_duration && <span className="duration">{song.s_duration}</span>}
                </p>
              </div>
              <div className="song-card-actions">
                <button className="action-btn play-btn">
                  <FaPlay />
                </button>
                <button
                  className="action-btn remove-btn"
                  onClick={() => removeSong(song.s_sid)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FaMusic className="empty-icon" />
          <p className="empty-text">
            {searchTerm ? 'No songs found matching your search' : 'Your library is empty'}
          </p>
          {!searchTerm && (
            <button className="btn-primary" onClick={() => window.location.href = '/browse'}>
              Browse Music
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Library;