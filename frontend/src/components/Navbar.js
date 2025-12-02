import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeadphones, FaHome, FaMusic, FaList, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: <FaHome /> },
    { path: '/browse', label: 'Browse', icon: <FaMusic /> },
    { path: '/library', label: 'Library', icon: <FaHeadphones /> },
    { path: '/playlists', label: 'Playlists', icon: <FaList /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo custom - T*/}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <FaHeadphones />
          </div>
          <span className="logo-text">TAAS</span>
        </Link>

        {/* Desktop Nav Links - ARI */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* User Section - ARI*/}
        <div className="navbar-user">
          <div className="user-info">
            <div className="user-avatar">
              <FaUser />
            </div>
            <span className="user-name">{user?.u_username}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>

        {/* MM Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MM */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="mobile-logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;