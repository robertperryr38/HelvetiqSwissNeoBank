import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Settings.css';

function Settings({ onBack }) {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="settings-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="settings-container">
        <motion.div className="settings-header" variants={itemVariants}>
          <button className="settings-back-btn" onClick={onBack}>
            ← Back
          </button>
          <h1 className="settings-title">Settings</h1>
          <div style={{ width: '40px' }} />
        </motion.div>

        <motion.div
          className="settings-sections"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="settings-section" variants={itemVariants}>
            <h2 className="settings-section__title">Notifications</h2>

            <motion.div className="settings-item" variants={itemVariants}>
              <div className="settings-item__info">
                <span className="settings-item__label">Enable notifications</span>
                <p className="settings-item__description">
                  Receive updates from the bank
                </p>
              </div>
              <div className="settings-toggle">
                <input
                  type="checkbox"
                  className="settings-toggle__input"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  id="notifications-toggle"
                />
                <label htmlFor="notifications-toggle" className="settings-toggle__label" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div className="settings-section" variants={itemVariants}>
            <h2 className="settings-section__title">Language</h2>

            <motion.div className="settings-item" variants={itemVariants}>
              <div className="settings-item__info">
                <span className="settings-item__label">App language</span>
              </div>
              <select
                className="settings-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
              </select>
            </motion.div>
          </motion.div>

          <motion.div className="settings-section" variants={itemVariants}>
            <h2 className="settings-section__title">Appearance</h2>

            <motion.div className="settings-item" variants={itemVariants}>
              <div className="settings-item__info">
                <span className="settings-item__label">Theme</span>
              </div>
              <select
                className="settings-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Automatic</option>
              </select>
            </motion.div>
          </motion.div>

          <motion.div className="settings-section" variants={itemVariants}>
            <h2 className="settings-section__title">About the app</h2>

            <motion.div className="settings-item" variants={itemVariants}>
              <div className="settings-item__info">
                <span className="settings-item__label">Version</span>
                <p className="settings-item__description">1.0.0</p>
              </div>
            </motion.div>

            <motion.div className="settings-item" variants={itemVariants}>
              <div className="settings-item__info">
                <span className="settings-item__label">Developer</span>
                <p className="settings-item__description">Helvetiq Bank</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Settings;
