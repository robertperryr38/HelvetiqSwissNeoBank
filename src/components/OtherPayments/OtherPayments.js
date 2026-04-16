import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './OtherPayments.css';

function OtherPayments({ isOpen, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ paymentName: '', amount: '' });
  const [errors, setErrors] = useState({});

  const categories = [
    { id: 1, name: 'Internet', icon: '🌐', color: '#3b82f6' },
    { id: 2, name: 'Mobile', icon: '📱', color: '#8b5cf6' },
    { id: 3, name: 'Utilities', icon: '💡', color: '#10b981' },
    { id: 4, name: 'Other', icon: '⚙️', color: '#f59e0b' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.paymentName.trim()) {
      newErrors.paymentName = 'Enter the payment name';
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = 'Enter the amount';
    } else if (amount < 10) {
      newErrors.amount = 'Minimum amount is €10';
    } else if (amount > 1000000) {
      newErrors.amount = 'Maximum amount is €1,000,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Request created:', {
        category: selectedCategory?.name,
        ...formData,
      });
      setFormData({ paymentName: '', amount: '' });
      setSelectedCategory(null);
      onClose();
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setErrors({});
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
    setFormData({ paymentName: '', amount: '' });
    setErrors({});
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: '100%' },
    visible: {
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 },
    },
    exit: { y: '100%', transition: { duration: 0.2 } },
  };

  const categoryVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const categoryItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      x: 30,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="other-payments-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleBackdropClick}
          />

          <motion.div
            className="other-payments-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(e, info) => {
              if (info.velocity.y > 20 || info.offset.y > 100) {
                onClose();
              }
            }}
          >
            <div className="other-payments-modal__handle" />

            {!selectedCategory ? (
              <motion.div
                className="other-payments-modal__content"
                variants={categoryVariants}
                initial="hidden"
                animate="visible"
              >
                <h2 className="other-payments-modal__title">Choose a category</h2>

                <div className="categories-grid">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      className="category-card"
                      variants={categoryItemVariants}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategorySelect(category)}
                    >
                      <div className="category-card__icon">{category.icon}</div>
                      <span className="category-card__name">{category.name}</span>
                      <div className="category-card__glow" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="other-payments-modal__content other-payments-modal__content--form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <button
                  className="other-payments-modal__back"
                  onClick={handleBackClick}
                >
                  ← Back
                </button>

                <h2 className="other-payments-modal__title">
                  Payment: {selectedCategory.name}
                </h2>

                <div className="other-payments-modal__input-group">
                  <label className="other-payments-modal__label">
                    Payment name
                  </label>
                  <div className="other-payments-modal__input-wrapper">
                    <input
                      type="text"
                      className={`other-payments-modal__input ${
                        errors.paymentName ? 'error' : ''
                      }`}
                      placeholder="Payment name"
                      value={formData.paymentName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentName: e.target.value,
                        })
                      }
                    />
                    <span className="other-payments-modal__input-icon">
                      {selectedCategory.icon}
                    </span>
                  </div>
                  {errors.paymentName && (
                    <motion.span
                      className="other-payments-modal__error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ⚠️ {errors.paymentName}
                    </motion.span>
                  )}
                </div>

                <div className="other-payments-modal__input-group">
                  <label className="other-payments-modal__label">Amount</label>
                  <div className="other-payments-modal__input-wrapper">
                    <input
                      type="number"
                      className={`other-payments-modal__input ${
                        errors.amount ? 'error' : ''
                      }`}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                    />
                    <span className="other-payments-modal__currency">€</span>
                  </div>
                  {errors.amount && (
                    <motion.span
                      className="other-payments-modal__error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ⚠️ {errors.amount}
                    </motion.span>
                  )}
                </div>

                <div className="other-payments-modal__info">
                  <span className="other-payments-modal__info-icon">ℹ️</span>
                  <span className="other-payments-modal__info-text">
                    Request review may take up to 24 hours
                  </span>
                </div>

                <motion.button
                  className="other-payments-modal__submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                >
                  Create request
                </motion.button>

                <motion.button
                  className="other-payments-modal__close"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBackClick}
                >
                  Cancel
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default OtherPayments;
