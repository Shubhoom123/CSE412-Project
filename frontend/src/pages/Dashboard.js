import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { musicAPI } from '../services/api';
import { FaMusic, FaHeadphones, FaList, FaPlay, FaHeart, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentSongs, setRecentSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const statsResponse = await musicAPI.getLibraryStats(user.u_uid);
      setStats(statsResponse.data.data);
      
      const libraryResponse = await musicAPI.getLibrary(user.u_uid);
      setRecentSongs(libraryResponse.data.data.slice(0, 5));
      
      const playlistsResponse = await musicAPI.getPlaylists(user.u_uid);
      setPlaylists(playlistsResponse.data.data.slice(0, 4));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-lg mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <div className="dashboard-welcome">
        <h1 className="dashboard-title">
          Welcome back, <span className="dashboard-username">{user.u_username}</span>!
        </h1>
        <p className="dashboard-subtitle">Here's what's happening with your music</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card fade-in">
          <div className="stat-icon orange">
            <FaMusic />
          </div>
          <p className="stat-title">Total Songs</p>
          <p className="stat-value">{stats?.totalSongs || 0}</p>
        </div>

        <div className="stat-card fade-in-delay-1">
          <div className="stat-icon yellow">
            <FaHeadphones />
          </div>
          <p className="stat-title">Artists</p>
          <p className="stat-value">{stats?.uniqueArtists || 0}</p>
        </div>

        <div className="stat-card fade-in-delay-2">
          <div className="stat-icon orange">
            <FaList />
          </div>
          <p className="stat-title">Albums</p>
          <p className="stat-value">{stats?.uniqueAlbums || 0}</p>
        </div>

        <div className="stat-card fade-in-delay-3">
          <div className="stat-icon red">
            <FaHeart />
          </div>
          <p className="stat-title">Playlists</p>
          <p className="stat-value">{playlists.length}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Songs */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Recently Added</h2>
            <Link to="/library" className="section-link">
              View All
            </Link>
          </div>
          
          {recentSongs.length > 0 ? (
            <div>
              {recentSongs.map((song) => (
                <div key={song.s_sid} className="song-item">
                  <div className="song-thumbnail">
                    <FaMusic />
                  </div>
                  <div className="song-info">
                    <p className="song-title">{song.s_title}</p>
                    <p className="song-artist">{song.ar_artistname}</p>
                  </div>
                  <button className="song-play-btn">
                    <FaPlay />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaMusic className="empty-icon" />
              <p className="empty-text">No songs in your library yet</p>
              <Link to="/browse" className="empty-link">
                Browse Music
              </Link>
            </div>
          )}
        </div>

        {/* Your Playlists */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Your Playlists</h2>
            <Link to="/playlists" className="section-link">
              View All
            </Link>
          </div>
          
          {playlists.length > 0 ? (
            <div className="playlist-grid">
              {playlists.map((playlist) => (
                <Link
                  key={playlist.p_pid}
                  to={`/playlists/${playlist.p_pid}`}
                  className="playlist-card"
                >
                  <div className="playlist-cover">
                    <FaList />
                  </div>
                  <p className="playlist-title">{playlist.p_title}</p>
                  <p className="playlist-description">
                    {playlist.p_description || 'No description'}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaList className="empty-icon" />
              <p className="empty-text">No playlists created yet</p>
              <button className="btn-primary mt-4">
                <FaPlus className="inline mr-2" /> Create Playlist
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Genre Distribution */}
      {stats?.genreDistribution && stats.genreDistribution.length > 0 && (
        <div className="section-card">
          <h2 className="section-title mb-6">Your Music by Genre</h2>
          <div className="genre-grid">
            {stats.genreDistribution.slice(0, 8).map((genre) => (
              <div key={genre.s_genre} className="genre-card">
                <p className="genre-count">{genre.count}</p>
                <p className="genre-name">{genre.s_genre || 'Unknown'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/browse" className="action-card">
          <FaMusic className="action-icon" />
          <h3 className="action-title">Browse Music</h3>
          <p className="action-description">Discover new artists, albums, and songs</p>
        </Link>
        
        <Link to="/library" className="action-card yellow">
          <FaHeadphones className="action-icon" />
          <h3 className="action-title">My Library</h3>
          <p className="action-description">Access your saved songs and favorites</p>
        </Link>
        
        <Link to="/playlists" className="action-card red">
          <FaList className="action-icon" />
          <h3 className="action-title">Playlists</h3>
          <p className="action-description">Create and manage your playlists</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;