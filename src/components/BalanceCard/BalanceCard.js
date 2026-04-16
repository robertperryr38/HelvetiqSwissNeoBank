import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './BalanceCard.css';

function BalanceCard() {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  const yParallax = useTransform(scrollY, [0, 200], [0, 50]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const balanceVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const formatBalance = (amount) => {
    return Number(amount).toLocaleString('en-US');
  };

  return (
    <>
      {isOpen && (
        <motion.div
          className="balance-card__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <motion.div
        ref={ref}
        className={`balance-card ${isOpen ? 'balance-card--open' : ''}`}
        onClick={() => setIsOpen(true)}
        animate={{
          position: isOpen ? 'fixed' : 'relative',
          left: isOpen ? '50%' : 'auto',
          top: isOpen ? '50%' : 'auto',
          transform: isOpen ? 'translate(-50%, -50%)' : 'none',
          scale: isOpen ? 1.1 : 1,
          zIndex: isOpen ? 1000 : 10,
        }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        style={isOpen ? {} : { y: yParallax }}
      >
        <div className="balance-card__visual">
          <div className="balance-card__background">
            <motion.div
              className="balance-card__glow balance-card__glow--1"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="balance-card__glow balance-card__glow--2"
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            />
          </div>
        </div>

        <motion.div
          className="balance-card__content-area"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="balance-card__header" variants={itemVariants}>
            <span className="balance-card__label">Main Account</span>
            <motion.div
              className="balance-card__menu"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              ⋯
            </motion.div>
          </motion.div>

          <motion.div
            className="balance-card__content"
            variants={balanceVariants}
          >
            <div className="balance-card__amount">
              <span className="balance-card__value">{formatBalance(125738)}</span>
              <span className="balance-card__currency">€</span>
            </div>
          </motion.div>

          <motion.div
            className="balance-card__balance-row"
            variants={itemVariants}
            whileHover={{ x: 4 }}
          >
            <div className="balance-card__info">
              <span className="balance-card__info-label">Own Funds</span>
              <span className="balance-card__info-value">
                {formatBalance(125738)} €
              </span>
            </div>
          </motion.div>

          <motion.div
            className="balance-card__balance-row"
            variants={itemVariants}
            whileHover={{ x: 4 }}
          >
            <div className="balance-card__info">
              <span className="balance-card__info-label">Credit Limit</span>
              <span className="balance-card__info-value">
                {formatBalance(50000)} €
              </span>
            </div>
          </motion.div>

          <motion.div className="balance-card__footer" variants={itemVariants}>
            <div className="balance-card__card-number">
              •••• •••• •••• 2847
            </div>
            <div className="balance-card__holder">Helvetiq Bank User</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default BalanceCard;
