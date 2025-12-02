import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { musicAPI } from '../services/api';
import {
  FaMusic,
  FaUser,
  FaCompactDisc,
  FaPlus,
  FaSearch,
  FaListUl,
  FaTimes,
} from 'react-icons/fa';
import './Browse.css';

const Browse = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('songs');
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // playlist modal state
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'songs': {
          const songsRes = await musicAPI.getSongs();
          setSongs(songsRes.data.data);
          break;
        }
        case 'artists': {
          const artistsRes = await musicAPI.getArtists();
          setArtists(artistsRes.data.data);
          break;
        }
        case 'albums': {
          const albumsRes = await musicAPI.getAlbums();
          setAlbums(albumsRes.data.data);
          break;
        }
        default:
          break;
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const addToLibrary = async (songId) => {
    try {
      await musicAPI.addSongToLibrary(user.u_uid, songId);
      alert('Song added to your library!');
    } catch (error) {
      console.error('Error adding to library:', error);
      alert(error.response?.data?.error || 'Failed to add song');
    }
  };

  // open modal and load playlists
  const openAddToPlaylist = async (song) => {
    setSelectedSong(song);
    setPlaylistModalOpen(true);

    if (playlists.length === 0) {
      try {
        setPlaylistLoading(true);
        const res = await musicAPI.getPlaylists(user.u_uid);
        setPlaylists(res.data.data || []);
      } catch (error) {
        console.error('Error loading playlists:', error);
        alert('Failed to load playlists. Please create one on the Playlists page first.');
        setPlaylistModalOpen(false);
      } finally {
        setPlaylistLoading(false);
      }
    }
  };

  const closeAddToPlaylist = () => {
    setPlaylistModalOpen(false);
    setSelectedSong(null);
  };

  const handleAddSongToPlaylist = async (playlistId) => {
    if (!selectedSong) return;

    try {
      await musicAPI.addSongToPlaylist(playlistId, selectedSong.s_sid);
      alert('Song added to playlist!');
      setPlaylistModalOpen(false);
      setSelectedSong(null);
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      alert(error.response?.data?.error || 'Failed to add song to playlist');
    }
  };

  const filterItems = (items, searchFields) => {
    if (!searchTerm) return items;
    return items.filter((item) =>
      searchFields.some((field) =>
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1 className="browse-title">Browse Music</h1>
        <p className="browse-subtitle">Discover new artists, albums, and songs</p>
      </div>

      {/* Tabs */}
      <div className="browse-tabs">
        <button
          className={`tab-btn ${activeTab === 'songs' ? 'active' : ''}`}
          onClick={() => setActiveTab('songs')}
        >
          <FaMusic /> Songs
        </button>
        <button
          className={`tab-btn ${activeTab === 'artists' ? 'active' : ''}`}
          onClick={() => setActiveTab('artists')}
        >
          <FaUser /> Artists
        </button>
        <button
          className={`tab-btn ${activeTab === 'albums' ? 'active' : ''}`}
          onClick={() => setActiveTab('albums')}
        >
          <FaCompactDisc /> Albums
        </button>
      </div>

      {/* Search */}
      <div className="browse-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner-lg"></div>
          <p>Loading {activeTab}...</p>
        </div>
      ) : (
        <>
          {activeTab === 'songs' && (
            <SongsGrid
              songs={filterItems(songs, ['s_title', 'ar_artistname', 's_genre'])}
              onAddToLibrary={addToLibrary}
              onAddToPlaylist={openAddToPlaylist}
            />
          )}
          {activeTab === 'artists' && (
            <ArtistsGrid
              artists={filterItems(artists, ['ar_artistname', 'ar_country'])}
            />
          )}
          {activeTab === 'albums' && (
            <AlbumsGrid
              albums={filterItems(albums, ['al_title', 'ar_artistname'])}
            />
          )}
        </>
      )}

      {/* Add-to-playlist modal */}
      <AddToPlaylistModal
        isOpen={playlistModalOpen}
        onClose={closeAddToPlaylist}
        playlists={playlists}
        loading={playlistLoading}
        song={selectedSong}
        onSelectPlaylist={handleAddSongToPlaylist}
      />
    </div>
  );
};

// Songs Grid Component
const SongsGrid = ({ songs, onAddToLibrary, onAddToPlaylist }) => {
  if (songs.length === 0) {
    return (
      <div className="empty-state">
        <FaMusic className="empty-icon" />
        <p className="empty-text">No songs found</p>
      </div>
    );
  }

  return (
    <div className="browse-grid">
      {songs.map((song) => (
        <div key={song.s_sid} className="browse-card">
          <div className="card-thumbnail">
            <FaMusic />
          </div>
          <div className="card-info">
            <h3 className="card-title">{song.s_title}</h3>
            <p className="card-subtitle">{song.ar_artistname}</p>
            {song.album_title && <p className="card-meta">{song.album_title}</p>}
            {song.s_genre && <span className="genre-tag">{song.s_genre}</span>}
          </div>
          <div className="browse-card-actions">
            <button
              className="add-btn"
              onClick={() => onAddToLibrary(song.s_sid)}
            >
              <FaPlus /> Add to Library
            </button>
            <button
              className="add-btn secondary"
              onClick={() => onAddToPlaylist(song)}
            >
              <FaListUl /> Add to Playlist
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Artists Grid Component
const ArtistsGrid = ({ artists }) => {
  if (artists.length === 0) {
    return (
      <div className="empty-state">
        <FaUser className="empty-icon" />
        <p className="empty-text">No artists found</p>
      </div>
    );
  }

  return (
    <div className="browse-grid">
      {artists.map((artist) => (
        <div key={artist.ar_artistid} className="browse-card">
          <div className="card-thumbnail artist">
            <FaUser />
          </div>
          <div className="card-info">
            <h3 className="card-title">{artist.ar_artistname}</h3>
            {artist.ar_country && (
              <p className="card-subtitle">{artist.ar_country}</p>
            )}
            {artist.ar_birth_year && (
              <p className="card-meta">Born: {artist.ar_birth_year}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Albums Grid Component
const AlbumsGrid = ({ albums }) => {
  if (albums.length === 0) {
    return (
      <div className="empty-state">
        <FaCompactDisc className="empty-icon" />
        <p className="empty-text">No albums found</p>
      </div>
    );
  }

  return (
    <div className="browse-grid">
      {albums.map((album) => (
        <div key={album.al_albumid} className="browse-card">
          <div className="card-thumbnail album">
            <FaCompactDisc />
          </div>
          <div className="card-info">
            <h3 className="card-title">{album.al_title}</h3>
            <p className="card-subtitle">{album.ar_artistname}</p>
            {album.al_release_date && (
              <p className="card-meta">
                {new Date(album.al_release_date).getFullYear()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Modal for choosing playlist
const AddToPlaylistModal = ({
  isOpen,
  onClose,
  playlists,
  loading,
  song,
  onSelectPlaylist,
}) => {
  if (!isOpen || !song) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Add to Playlist</h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <p className="modal-subtitle">
          Choose a playlist for <span className="song-highlight">“{song.s_title}”</span>
        </p>

        {loading ? (
          <div className="loading-state">
            <div className="spinner-lg"></div>
            <p>Loading your playlists...</p>
          </div>
        ) : playlists.length === 0 ? (
          <p className="empty-text">
            You don’t have any playlists yet. Create one on the Playlists page first.
          </p>
        ) : (
          <div className="playlists-list">
            {playlists.map((pl) => (
              <button
                key={pl.p_pid}
                className="playlist-item"
                onClick={() => onSelectPlaylist(pl.p_pid)}
              >
                <div className="playlist-info">
                  <span className="playlist-name">{pl.p_title}</span>
                  {pl.p_description && (
                    <span className="playlist-description">
                      {pl.p_description}
                    </span>
                  )}
                </div>
                <FaListUl className="playlist-icon" />
              </button>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Browse;
