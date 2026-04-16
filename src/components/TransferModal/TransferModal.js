import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TransferModal.css';
import { apiUrl } from '../../config';

function TransferModal({ isOpen, onClose }) {
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const truncated = cleaned.slice(0, 16);
    return truncated.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleCardChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: null });
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (errors.amount) {
      setErrors({ ...errors, amount: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const cleanCard = cardNumber.replace(/\s/g, '');
    if (!cleanCard) {
      newErrors.cardNumber = 'Enter the card number';
    } else if (cleanCard.length !== 16) {
      newErrors.cardNumber = 'Card number must contain 16 digits';
    }

    const numAmount = parseFloat(amount);
    if (!amount) {
      newErrors.amount = 'Enter the amount';
    } else if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (numAmount < 10) {
      newErrors.amount = 'Minimum amount is €10';
    } else if (numAmount > 1000000) {
      newErrors.amount = 'Maximum amount is €1,000,000';
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        const token = localStorage.getItem('authToken');
        const user = JSON.parse(localStorage.getItem('user'));

        const response = await fetch(apiUrl('/transfer'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'user-id': user.id.toString(),
          },
          body: JSON.stringify({
            cardNumber: cardNumber.replace(/\s/g, ''),
            amount: parseFloat(amount),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Transfer request created:', data);
          alert(
            'Transfer request created. Please wait for administrator review.'
          );
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        console.error('Error creating transfer:', error);
        alert('Failed to create the transfer request');
      }

      setCardNumber('');
      setAmount('');
      setErrors({});
      onClose();
    } else {
      setErrors(newErrors);
    }
  };

  const modalVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 300 },
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="transfer-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleBackdropClick}
          />

          <motion.div
            className="transfer-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(event, info) => {
              if (info.velocity.y > 20 || info.offset.y > 100) {
                onClose();
              }
            }}
          >
            <motion.div
              className="transfer-modal__content"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="transfer-modal__handle"
                variants={itemVariants}
              />

              <motion.h2
                className="transfer-modal__title"
                variants={itemVariants}
              >
                Transfer Money
              </motion.h2>

              <motion.div
                className="transfer-modal__input-group"
                variants={itemVariants}
              >
                <label className="transfer-modal__label">
                  Recipient card number
                </label>
                <div className="transfer-modal__input-wrapper">
                  <input
                    type="text"
                    className={`transfer-modal__input ${
                      errors.cardNumber ? 'error' : ''
                    }`}
                    placeholder="Enter card number"
                    value={cardNumber}
                    onChange={handleCardChange}
                    maxLength="19"
                  />
                  <span className="transfer-modal__input-icon">💳</span>
                </div>
                {errors.cardNumber && (
                  <motion.span
                    className="transfer-modal__error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.cardNumber}
                  </motion.span>
                )}
              </motion.div>

              <motion.div
                className="transfer-modal__input-group"
                variants={itemVariants}
              >
                <label className="transfer-modal__label">Transfer amount</label>
                <div className="transfer-modal__input-wrapper">
                  <input
                    type="number"
                    className={`transfer-modal__input ${
                      errors.amount ? 'error' : ''
                    }`}
                    placeholder="Enter amount"
                    value={amount}
                    onChange={handleAmountChange}
                    min="1"
                    max="1000000"
                  />
                  <span className="transfer-modal__currency">€</span>
                </div>
                {errors.amount && (
                  <motion.span
                    className="transfer-modal__error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.amount}
                  </motion.span>
                )}
              </motion.div>

              <motion.div
                className="transfer-modal__info"
                variants={itemVariants}
              >
                <span className="transfer-modal__info-icon">ℹ️</span>
                <span className="transfer-modal__info-text">
                  Bank fee: free of charge
                </span>
              </motion.div>

              <motion.button
                className="transfer-modal__submit"
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
                disabled={!cardNumber || !amount}
              >
                Create request
              </motion.button>

              <motion.button
                className="transfer-modal__close"
                onClick={onClose}
                variants={itemVariants}
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default TransferModal;
