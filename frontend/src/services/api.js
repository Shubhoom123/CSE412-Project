import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authAPI = {
  login: (username, password) =>
    api.post('/users/login', { username, password }),

  register: (username, email, password) =>
    api.post('/users/register', { username, email, password }),
};


// Music endpoints
export const musicAPI = {
  // Artists
  getArtists: () => api.get('/artists'),
  getArtistById: (id) => api.get(`/artists/${id}`),
  createArtist: (data) => api.post('/artists', data),
  updateArtist: (id, data) => api.put(`/artists/${id}`, data),
  deleteArtist: (id) => api.delete(`/artists/${id}`),
  searchArtists: (name) => api.get(`/artists/search?name=${name}`),
  
  // Songs
  getSongs: () => api.get('/songs'),
  getSongById: (id) => api.get(`/songs/${id}`),
  createSong: (data) => api.post('/songs', data),
  updateSong: (id, data) => api.put(`/songs/${id}`, data),
  deleteSong: (id) => api.delete(`/songs/${id}`),
  searchSongs: (params) => api.get('/songs/search', { params }),
  getSongsByGenre: (genre) => api.get(`/songs/genre/${genre}`),
  
  // Albums
  getAlbums: () => api.get('/albums'),
  getAlbumById: (id) => api.get(`/albums/${id}`),
  createAlbum: (data) => api.post('/albums', data),
  updateAlbum: (id, data) => api.put(`/albums/${id}`, data),
  deleteAlbum: (id) => api.delete(`/albums/${id}`),
  getAlbumsByArtist: (artistId) => api.get(`/albums/artist/${artistId}`),
  
  // Playlists
  getPlaylists: (userId) => api.get(`/playlists/user/${userId}`),
  getPlaylistById: (id) => api.get(`/playlists/${id}`),
  createPlaylist: (data) => api.post('/playlists', data),
  updatePlaylist: (id, data) => api.put(`/playlists/${id}`, data),
  deletePlaylist: (id) => api.delete(`/playlists/${id}`),
  addSongToPlaylist: (playlistId, songId, position) => 
    api.post(`/playlists/${playlistId}/songs/${songId}`, { position }),
  removeSongFromPlaylist: (playlistId, songId) => 
    api.delete(`/playlists/${playlistId}/songs/${songId}`),
  reorderPlaylist: (playlistId, songPositions) => 
    api.put(`/playlists/${playlistId}/reorder`, { songPositions }),
  
  // Library
  getLibrary: (userId) => api.get(`/library/${userId}`),
  getLibraryStats: (userId) => api.get(`/library/${userId}/stats`),
  addSongToLibrary: (userId, songId) => 
    api.post(`/library/${userId}/songs/${songId}`),
  removeSongFromLibrary: (userId, songId) => 
    api.delete(`/library/${userId}/songs/${songId}`),
  isSongInLibrary: (userId, songId) => 
    api.get(`/library/${userId}/songs/${songId}`),
};

// User endpoints
export const userAPI = {
  getUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;