import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CashbackPage.css';
import { apiUrl } from '../../config';

function CashbackPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user) {
        return;
      }

      const response = await fetch(apiUrl('/users/me'), {
        headers: {
          Authorization: `Bearer ${token}`,
          'user-id': user.id.toString(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const cashbackBalance = userData?.cashback ?? 0;

  const categories = [
    { id: 'food', name: 'Food', icon: '🍔', color: '#f59e0b' },
    { id: 'taxi', name: 'Taxi', icon: '🚕', color: '#ef4444' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#a855f7' },
    { id: 'shops', name: 'Shopping', icon: '🛍️', color: '#06b6d4' },
  ];

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      if (prev.length < 3) {
        return [...prev, categoryId];
      }
      return prev;
    });
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="cashback-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="cashback-page__container">
        <motion.div className="cashback-page__header" variants={itemVariants}>
          <h1 className="cashback-page__title">My Cashback</h1>
          <p className="cashback-page__subtitle">Save more with every purchase</p>
        </motion.div>

        <motion.div className="cashback-balance" variants={itemVariants}>
          <div className="cashback-balance__label">Cashback balance</div>
          <motion.div
            className="cashback-balance__amount"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            {(cashbackBalance || 0).toLocaleString('en-US')} €
          </motion.div>
          <div className="cashback-balance__glow" />
        </motion.div>

        <motion.div
          className="cashback-categories"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="cashback-categories__title">Choose cashback categories</h2>
          <p className="cashback-categories__subtitle">
            Selected {selectedCategories.length} of 3
          </p>

          <div className="cashback-grid">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              const isDisabled = !isSelected && selectedCategories.length >= 3;

              return (
                <motion.button
                  key={category.id}
                  className={`cashback-card ${
                    isSelected ? 'active' : ''
                  } ${isDisabled ? 'disabled' : ''}`}
                  variants={itemVariants}
                  onClick={() => toggleCategory(category.id)}
                  disabled={isDisabled}
                  whileHover={!isDisabled ? { scale: 1.05, y: -4 } : {}}
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                  style={{
                    '--color': category.color,
                  }}
                >
                  <div className="cashback-card__glow" />

                  <motion.div
                    className="cashback-card__icon"
                    animate={isSelected ? { scale: 1.2 } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {category.icon}
                  </motion.div>

                  <span className="cashback-card__name">{category.name}</span>

                  <div className="cashback-card__toggle">
                    <motion.div
                      className="cashback-card__toggle-circle"
                      animate={isSelected ? { x: 24 } : { x: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  </div>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className="cashback-card__checkmark"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 25,
                        }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div className="cashback-info" variants={itemVariants}>
          <span className="cashback-info__icon">ℹ️</span>
          <span className="cashback-info__text">
            Selected categories earn up to 5% extra cashback
          </span>
        </motion.div>

        <motion.button
          className="cashback-page__apply"
          variants={itemVariants}
          whileHover={selectedCategories.length > 0 ? { scale: 1.02 } : {}}
          whileTap={selectedCategories.length > 0 ? { scale: 0.98 } : {}}
          disabled={selectedCategories.length === 0}
        >
          {selectedCategories.length > 0
            ? `Apply (${selectedCategories.length})`
            : 'Choose categories'}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default CashbackPage;
