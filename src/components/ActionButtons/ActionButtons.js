import React from 'react';
import { motion } from 'framer-motion';
import './ActionButtons.css';

function ActionButtons({ onPopovnit, onTransfer, onOtherPayments, onPendingDeposit }) {
  const actions = [
    { id: 1, icon: '💳', label: 'Deposit', action: 'popovnit' },
    { id: 2, icon: '➔', label: 'Transfer', action: 'transfer' },
    { id: 3, icon: '⚙️', label: 'Other Payments', action: 'other' },
    { id: 4, icon: '⏳', label: 'Pending', action: 'pending' },
  ];

  const handleRipple = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  };

  const handleClick = (action, e) => {
    handleRipple(e);

    if (action === 'popovnit' && onPopovnit) {
      onPopovnit();
    } else if (action === 'transfer' && onTransfer) {
      onTransfer();
    } else if (action === 'other' && onOtherPayments) {
      onOtherPayments();
    } else if (action === 'pending' && onPendingDeposit) {
      onPendingDeposit();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="action-buttons"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {actions.map((action) => (
        <motion.button
          key={action.id}
          className="action-button"
          variants={itemVariants}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => handleClick(action.action, e)}
        >
          <div className="action-button__circle">
            <span className="action-button__icon">{action.icon}</span>
          </div>
          <span className="action-button__label">{action.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

export default ActionButtons;
