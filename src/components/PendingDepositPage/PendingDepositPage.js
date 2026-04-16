import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './PendingDepositPage.css';
import { apiUrl } from '../../config';

const methodLabels = {
  card: 'Card',
  crypto: 'Crypto Wallet',
  account: 'Bank Account',
  phone: 'Phone',
};

function PendingDepositPage({ onBack }) {
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingDeposits = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const user = JSON.parse(localStorage.getItem('user'));

        const response = await fetch(apiUrl('/user/deposits'), {
          headers: {
            Authorization: `Bearer ${token}`,
            'user-id': user.id.toString(),
          },
        });

        if (response.ok) {
          const deposits = await response.json();
          const pending = deposits.filter((d) => d.status === 'pending');
          const requisitesProvided = deposits.filter(
            (d) => d.status === 'requisites_provided'
          );
          const processedWithRequisites = deposits.filter(
            (d) => d.status === 'processed' && d.requisites
          );
          setPendingDeposits([
            ...pending,
            ...requisitesProvided,
            ...processedWithRequisites,
          ]);
        }
      } catch (error) {
        console.error('Error fetching deposits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDeposits();
  }, []);

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (pendingDeposits.length === 0) {
    return (
      <motion.div
        className="pending-deposit-page"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="pending-deposit-page__header">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <h1>Deposit Status</h1>
        </div>
        <p>You do not have any active deposit requests.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="pending-deposit-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="pending-deposit-page__header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1>Deposit Status</h1>
      </div>

      <div className="pending-deposits-list">
        {pendingDeposits.map((deposit) => (
          <div key={deposit.id} className="pending-deposit-card">
            <div className="pending-deposit-card__info">
              <h3>Request #{deposit.id}</h3>
              <p>Amount: {Number(deposit.amount).toLocaleString('en-US')} €</p>
              <p>Method: {methodLabels[deposit.method] || deposit.method}</p>
              <p>
                Date: {new Date(deposit.createdAt).toLocaleString('en-GB')}
              </p>
            </div>
            <div className="pending-deposit-card__status">
              {deposit.status === 'pending' ? (
                <>
                  <span className="status-badge pending">
                    Waiting for payment details
                  </span>
                  <p>
                    The administrator will process your request shortly.
                  </p>
                </>
              ) : deposit.status === 'requisites_provided' ? (
                <>
                  <span className="status-badge requisites">
                    Payment details received
                  </span>
                  <p>
                    <strong>Payment details:</strong>
                  </p>
                  <p>{deposit.requisites}</p>
                  <p>
                    After payment, the administrator will credit the funds to
                    your account.
                  </p>
                </>
              ) : (
                <>
                  <span className="status-badge processed">Funds credited</span>
                  <p>
                    <strong>Payment details:</strong>
                  </p>
                  <p>{deposit.requisites}</p>
                  <p>The funds were successfully credited to your account.</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default PendingDepositPage;
