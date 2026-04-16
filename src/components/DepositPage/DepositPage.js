import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './DepositPage.css';

function DepositPage() {
  const [amount, setAmount] = useState(50000);
  const [term, setTerm] = useState(12);
  const [submitted, setSubmitted] = useState(false);

  const rates = {
    3: 8,
    6: 10,
    12: 12,
  };

  const currentRate = rates[term];
  const interest = Math.round(amount * (currentRate / 100) * 100) / 100;
  const totalAmount = amount + interest;

  const handleSubmit = () => {
    console.log('Deposit request:', {
      amount,
      term,
      rate: currentRate,
      interest,
      totalAmount,
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut', delay: 0.1 },
    },
  };

  return (
    <motion.div
      className="deposit-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="deposit-page__container" variants={cardVariants}>
        <div className="deposit-page__header">
          <h1 className="deposit-page__title">Open a Deposit</h1>
          <p className="deposit-page__subtitle">Grow your savings</p>
        </div>

        <div className="deposit-card">
          <div className="deposit-card__section">
            <label className="deposit-card__label">Deposit amount</label>
            <div className="deposit-card__input-wrapper">
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="deposit-card__slider"
              />
              <div className="deposit-card__amount-display">
                <motion.span
                  key={amount}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="deposit-card__amount-value"
                >
                  {amount.toLocaleString('en-US')} €
                </motion.span>
              </div>
            </div>
            <div className="deposit-card__range-labels">
              <span>1,000 €</span>
              <span>1,000,000 €</span>
            </div>
          </div>

          <div className="deposit-card__section">
            <label className="deposit-card__label">Deposit term</label>
            <div className="deposit-card__term-grid">
              {Object.entries(rates).map(([termValue, rate]) => (
                <motion.button
                  key={termValue}
                  className={`deposit-card__term-btn ${
                    term === Number(termValue) ? 'active' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTerm(Number(termValue))}
                >
                  <span className="deposit-card__term-text">{termValue}</span>
                  <span className="deposit-card__term-label">months</span>
                  <span className="deposit-card__term-rate">{rate}%</span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            className="deposit-card__calculation"
            key={`${amount}-${term}`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="deposit-card__calc-item">
              <span className="deposit-card__calc-label">Rate:</span>
              <motion.span
                className="deposit-card__calc-value"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                {currentRate}%
              </motion.span>
            </div>

            <div className="deposit-card__calc-item">
              <span className="deposit-card__calc-label">Profit:</span>
              <motion.span
                className="deposit-card__calc-value deposit-card__calc-value--accent"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                +{interest.toLocaleString('en-US')} €
              </motion.span>
            </div>

            <div className="deposit-card__calc-divider" />

            <div className="deposit-card__calc-item">
              <span className="deposit-card__calc-label">Total payout:</span>
              <motion.span
                className="deposit-card__calc-value deposit-card__calc-value--total"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                {totalAmount.toLocaleString('en-US')} €
              </motion.span>
            </div>
          </motion.div>

          <div className="deposit-card__chart">
            <div className="deposit-card__chart-label">Your deposit</div>
            <div className="deposit-card__chart-bars">
              <div className="deposit-card__chart-bar-container">
                <motion.div
                  className="deposit-card__chart-bar deposit-card__chart-bar--primary"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(amount / 1000000) * 100}%`,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <span className="deposit-card__chart-bar-label">
                    Principal
                  </span>
                </motion.div>
              </div>

              <div className="deposit-card__chart-bar-container">
                <motion.div
                  className="deposit-card__chart-bar deposit-card__chart-bar--accent"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(interest / 1000000) * 100}%`,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                >
                  <span className="deposit-card__chart-bar-label">Profit</span>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="deposit-card__info">
            <span className="deposit-card__info-icon">ℹ️</span>
            <span className="deposit-card__info-text">
              The deposit will be activated after administrator review
            </span>
          </div>

          <motion.button
            className="deposit-card__submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
          >
            {submitted ? '✓ Request sent' : 'Create request'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DepositPage;
