import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeadphones, FaMusic, FaPlay, FaUser, FaLock } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!username || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await login(username, password);
      setIsLoading(false);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Invalid username or password');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Connection error. Make sure backend is running on port 3001');
      console.error('Login error:', err);
    }
  };

  const handleDemoLogin = async (user) => {
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(user, 'pass123');
      setIsLoading(false);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Demo login failed');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Connection error. Make sure backend is running on port 3001');
      console.error('Demo login error:', err);
    }
  };

  return (
    <div className="login-container">
      {/* BM anime */}
      <div className="login-background">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="music-note"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${1.5 + Math.random() * 2}rem`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          >
            <FaMusic />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="login-content">
        <div className="content-wrapper">
          
          {/* Left: Brand Section */}
          <div className="brand-section">
            <div className="brand-container">
              <div className="logo-wrapper">
                <div className="main-logo">
                  <FaHeadphones className="text-4xl text-white" />
                </div>
                <div className="logo-badge">
                  <FaPlay className="text-sm text-white" />
                </div>
              </div>
              
              <h1 className="brand-title">TAAS</h1>
              <p className="brand-subtitle">Music Library</p>
              
              <h2 className="brand-tagline">
                Your Personal<br />Music Collection
              </h2>
              
              <p className="brand-description">
                You can work with the collection of music that we have, create playlists, rate them and more.
              </p>
              
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaMusic />
                  </div>
                  <span>Unlimited music storage</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaHeadphones />
                  </div>
                  <span>Personalized playlists</span>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="form-section">
            <div className="login-card">
              <div className="login-header">
                <h3 className="login-title">Welcome Back</h3>
                <p className="login-subtitle">Sign in to access your music library</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* User Input */}
                <div className="input-group">
                  <label className="input-label">Username</label>
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-field"
                      placeholder="Enter your username"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                {/* Pass Input */}
                <div className="input-group">
                  <label className="input-label">Password</label>
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="error-message">
                    <p className="error-text">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-button"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Create Account Link */}
              <div className="auth-toggle">
                <span className="auth-toggle-text">Don't have an account?</span>
                <Link to="/register" className="auth-toggle-link">
                  Create Account
                </Link>
              </div>

              {/* Demo Accounts */}
              <div className="demo-section">
                <h4 className="demo-title">Quick Demo Access</h4>
                <div className="demo-grid">
                  <button
                    onClick={() => handleDemoLogin('shubham')}
                    disabled={isLoading}
                    className="demo-account"
                  >
                    <div className="demo-avatar shubham">S</div>
                    <div className="demo-info">
                      <div className="demo-name">Shubham</div>
                      <div className="demo-hint">Click to login</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleDemoLogin('anshika')}
                    disabled={isLoading}
                    className="demo-account"
                  >
                    <div className="demo-avatar anshika">A</div>
                    <div className="demo-info">
                      <div className="demo-name">Anshika</div>
                      <div className="demo-hint">Click to login</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="login-footer">
                <p>© 2024 TAAS Music Library • CSE 412 Project</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;