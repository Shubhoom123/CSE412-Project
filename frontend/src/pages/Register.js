import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeadphones, FaMusic, FaPlay, FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import './Login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await register(username, email, password);
      setIsLoading(false);
      
      if (result.success) {
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Connection error. Make sure backend is running on port 3001');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="login-container">
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

      <div className="login-content">
        <div className="content-wrapper">
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
                Join Our<br />Music Community
              </h2>
              
              <p className="brand-description">
                Create your account
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

          <div className="form-section">
            <div className="login-card">
              <div className="login-header">
                <h3 className="login-title">Create Account</h3>
                <p className="login-subtitle">Sign up to start your music journey</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label className="input-label">Username</label>
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-field"
                      placeholder="Choose a username"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Email</label>
                  <div className="input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      placeholder="Enter your email"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="input-group">
                  <label className="input-label">Password</label>
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      placeholder="Create a password (min 6 chars)"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field"
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <p className="error-text">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="success-message">
                    <p className="success-text">{success}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-button"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="auth-toggle">
                <span className="auth-toggle-text">Already have an account?</span>
                <Link to="/login" className="auth-toggle-link">
                  Sign In
                </Link>
              </div>

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

export default Register;