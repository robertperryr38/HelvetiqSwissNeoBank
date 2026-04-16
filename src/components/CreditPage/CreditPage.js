import React from 'react';
import { motion } from 'framer-motion';
import './CreditPage.css';

function CreditPage() {
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

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: 0.1,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="credit-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="credit-page__container">
        <motion.div
          className="credit-page__icon"
          variants={iconVariants}
        >
          🔒
        </motion.div>

        <motion.h1
          className="credit-page__title"
          variants={textVariants}
        >
          Feature Coming Soon
        </motion.h1>

        <motion.p
          className="credit-page__subtitle"
          variants={textVariants}
          transition={{ delay: 0.3 }}
        >
          This feature will be available in the near future
        </motion.p>
      </div>
    </motion.div>
  );
}

export default CreditPage;
