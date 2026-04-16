import React from 'react';
import { motion } from 'framer-motion';
import './BottomNavigation.css';

function BottomNavigation({ currentPage = 'home', onPageChange }) {
  const navItems = [
    { id: 'home', icon: '💳', label: 'Card' },
    { id: 'credit', icon: '📊', label: 'Credit' },
    { id: 'deposit', icon: '🏦', label: 'Deposit' },
    { id: 'cashback', icon: '🎁', label: 'Cashback' },
    { id: 'more', icon: '⋯', label: 'More' },
  ];

  const handleNavClick = (id) => {
    if (onPageChange) {
      onPageChange(id);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.nav
      className="bottom-navigation"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
          onClick={() => handleNavClick(item.id)}
          whileTap={{ scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <motion.div
            className="nav-item__icon-wrapper"
            animate={{
              scale: currentPage === item.id ? 1.2 : 1,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <span className="nav-item__icon">{item.icon}</span>
          </motion.div>

          <motion.span
            className="nav-item__label"
            animate={{
              color: currentPage === item.id
                ? 'rgba(139, 92, 246, 1)'
                : 'rgba(255, 255, 255, 0.5)',
            }}
            transition={{ duration: 0.3 }}
          >
            {item.label}
          </motion.span>

          {currentPage === item.id && (
            <motion.div
              className="nav-item__indicator"
              layoutId="activeIndicator"
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
          )}
        </motion.button>
      ))}
    </motion.nav>
  );
}

export default BottomNavigation;
