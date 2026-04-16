import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './TransactionsList.css';
import { apiUrl } from '../../config';

const methodLabels = {
  card: 'card',
  crypto: 'crypto wallet',
  account: 'bank account',
  phone: 'phone',
};

function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user) {
          setLoading(false);
          return;
        }

        const response = await fetch(apiUrl('/transactions'), {
          headers: {
            Authorization: `Bearer ${token}`,
            'user-id': user.id.toString(),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const formatAmount = (amount) => Number(amount).toLocaleString('en-US');

  const normalizeDescription = (transaction) => {
    const raw = (transaction.description || '').trim();
    const lowered = raw.toLowerCase();

    if (lowered.includes('пополнение через') || lowered.includes('поповнення через')) {
      const method = raw.split(/через/i)[1]?.trim().toLowerCase();
      const methodLabel = methodLabels[method] || method || 'selected method';
      return `Top-up via ${methodLabel}`;
    }

    if (lowered.includes('перевод') || lowered.includes('переказ')) {
      return 'Transfer';
    }

    if (lowered.includes('депозит')) {
      return 'Deposit';
    }

    if (lowered.includes('кешбек') || lowered.includes('cashback')) {
      return 'Cashback';
    }

    if (!raw) {
      return transaction.type === 'income' ? 'Incoming transaction' : 'Outgoing transaction';
    }

    return raw
      .replace(/Пополнение через/gi, 'Top-up via')
      .replace(/Поповнення через/gi, 'Top-up via')
      .replace(/Перевод/gi, 'Transfer')
      .replace(/Переказ/gi, 'Transfer')
      .replace(/Депозит/gi, 'Deposit');
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="transactions-list">
        <motion.h2
          className="transactions-list__title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Transaction History
        </motion.h2>
        <p>You do not have any transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="transactions-list">
      <motion.h2
        className="transactions-list__title"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Transaction History
      </motion.h2>

      <motion.div
        className="transactions-list__content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {transactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            className="transaction-item"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="transaction-item__left">
              <div className="transaction-item__category">
                {transaction.category || '💰'}
              </div>

              <div className="transaction-item__info">
                <h3 className="transaction-item__name">
                  {normalizeDescription(transaction)}
                </h3>
                <span className="transaction-item__description">
                  {new Date(transaction.createdAt).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>

            <div className="transaction-item__right">
              <div className={`transaction-item__amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '−'} {formatAmount(transaction.amount)} €
              </div>
              <span className="transaction-item__time">
                {new Date(transaction.createdAt).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        className="transactions-list__button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        View full history →
      </motion.button>
    </div>
  );
}

export default TransactionsList;
