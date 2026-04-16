import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';
import { apiUrl } from '../../config';

function Modal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');

  const methods = [
    { id: 'card', icon: '💳', label: 'Card' },
    { id: 'crypto', icon: '₿', label: 'Crypto Wallet' },
    { id: 'account', icon: '🏦', label: 'Bank Account' },
    { id: 'phone', icon: '📱', label: 'Phone' },
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (amount && selectedMethod) {
      try {
        const token = localStorage.getItem('authToken');
        const user = JSON.parse(localStorage.getItem('user'));

        const response = await fetch(apiUrl('/deposit'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'user-id': user.id.toString(),
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            method: selectedMethod,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Deposit request created:', data);
          alert(
            'Deposit request created. Please wait for payment details from the administrator.'
          );
          if (onSuccess) onSuccess();
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        console.error('Error creating deposit:', error);
        alert('Failed to create the deposit request');
      }

      setAmount('');
      setSelectedMethod('card');
      onClose();
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
            className="modal-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleBackdropClick}
          />

          <motion.div
            className="modal"
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
              className="modal__content"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="modal__handle" variants={itemVariants} />

              <motion.h2 className="modal__title" variants={itemVariants}>
                Choose a top-up method
              </motion.h2>

              <motion.div className="modal__methods" variants={itemVariants}>
                {methods.map((method, index) => (
                  <motion.button
                    key={method.id}
                    className={`modal__method ${
                      selectedMethod === method.id ? 'active' : ''
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="modal__method-icon">{method.icon}</span>
                    <span className="modal__method-label">{method.label}</span>
                  </motion.button>
                ))}
              </motion.div>

              <motion.div className="modal__input-group" variants={itemVariants}>
                <label className="modal__label">Top-up amount</label>
                <div className="modal__input-wrapper">
                  <input
                    type="number"
                    className="modal__input"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                  />
                  <span className="modal__currency">€</span>
                </div>
              </motion.div>

              <motion.button
                className="modal__submit"
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
                disabled={!amount}
              >
                Create request
              </motion.button>

              <motion.button
                className="modal__close"
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

export default Modal;
