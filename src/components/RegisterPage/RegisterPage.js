import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './RegisterPage.css';
import { apiUrl } from '../../config';

function RegisterPage({ onRegisterSuccess, onSwitchToLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [fullName, setFullName] = useState('');
  const [passport, setPassport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!login.trim()) {
      setError('Username is required');
      return;
    }

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!passport.trim()) {
      setError('Passport number is required');
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl('/users/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password, fullName, passport }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      setSuccess('✓ Registration successful! Please submit your passport for verification.');
      setTimeout(() => {
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
        onRegisterSuccess();
      }, 1500);
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
      className="register-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="register-container">
        <button
          type="button"
          className="register-back"
          onClick={onSwitchToLogin}
        >
          ← Back
        </button>

        <div className="register-header">
          <motion.div
            className="register-icon"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎉
          </motion.div>
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join Helvetiq Bank</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
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
              minLength="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="form-input"
              placeholder="e.g. John Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passport" className="form-label">
              Passport Number
            </label>
            <input
              id="passport"
              type="text"
              className="form-input"
              placeholder="e.g. AB123456"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
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
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm" className="form-label">
              Confirm Password
            </label>
            <input
              id="passwordConfirm"
              type="password"
              className="form-input"
              placeholder="Repeat your password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              minLength="6"
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

          {success && (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {success}
            </motion.div>
          )}

          <button
            type="submit"
            className="register-button"
            disabled={loading || success}
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>

        <div className="register-footer">
          <p className="register-text">Already have an account?</p>
          <button
            type="button"
            className="login-link"
            onClick={onSwitchToLogin}
          >
            Sign In
          </button>
        </div>

        <div className="register-terms">
          <p className="terms-text">
            By signing up, you agree to our
            <br />
            <button type="button" className="terms-link">
              Terms of Service
            </button>{' '}
            and
            <button type="button" className="terms-link">
              {' '}
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default RegisterPage;
