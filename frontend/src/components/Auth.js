import React, { useState } from 'react';

const Auth = ({ onAuthSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLoginMode) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    // Simple validation - in real app, this would call a backend API
    const username = email.split('@')[0];
    localStorage.setItem('username', username);
    onAuthSuccess(username);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>💬 Just Chat</h1>
        
        <div className="auth-tabs">
          <button
            className={`tab-btn ${isLoginMode ? 'active' : ''}`}
            onClick={() => {
              setIsLoginMode(true);
              setError('');
              setConfirmPassword('');
            }}
          >
            Login
          </button>
          <button
            className={`tab-btn ${!isLoginMode ? 'active' : ''}`}
            onClick={() => {
              setIsLoginMode(false);
              setError('');
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              onKeyPress={handleKeyPress}
            />
          </div>

          {!isLoginMode && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                onKeyPress={handleKeyPress}
              />
            </div>
          )}

          <button type="submit" className="auth-btn">
            {isLoginMode ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLoginMode ? "Don't have an account? " : 'Already have an account? '}
            <span 
              className="toggle-auth" 
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
            >
              {isLoginMode ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
