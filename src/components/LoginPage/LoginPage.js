import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './LoginPage.css';
import { apiUrl } from '../../config';

function LoginPage({ onLoginSuccess, onSwitchToRegister }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data.user.id,
          login: data.user.login,
          fullName: data.user.fullName,
          status: data.user.status,
          balance: data.user.balance,
          cashback: data.user.cashback || 0,
        })
      );
      localStorage.setItem('authToken', data.token || 'authenticated');

      onLoginSuccess();
    } catch (err) {
      setError('Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="login-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="login-container">
        <div className="login-header">
          <motion.div
            className="login-icon"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💳
          </motion.div>
          <h1 className="login-title">Helvetiq Bank</h1>
          <p className="login-subtitle">Modern Digital Bank</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login" className="form-label">
              Username
            </label>
            <input
              id="login"
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-text">Don&apos;t have an account?</p>
          <button
            type="button"
            className="register-link"
            onClick={onSwitchToRegister}
          >
            Sign Up
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default LoginPage;
