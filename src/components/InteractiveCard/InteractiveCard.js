import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './InteractiveCard.css';
import { apiUrl } from '../../config';

function InteractiveCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !user) {
        setLoading(false);
        return;
      }

      const response = await fetch(apiUrl('/users/me'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user.id.toString()
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Автообновление данных каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserData();
    }, 5000); // Обновляем каждые 5 секунд

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  const cardData = {
    number: '4532 1488 0343 6467',
    name: (userData && userData.fullName) ? userData.fullName.toUpperCase() : 'CARDHOLDER',
    expiry: '12/26',
    cvv: '537',
  };

  const balanceData = {
    balance: userData ? userData.balance : 0,
    creditLimit: 0,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Overlay затемнения */}
      {isExpanded && (
        <motion.div
          className="card-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Основной контейнер - баланс + карта */}
      <motion.div
        className={`balance-card-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}
        animate={{
          position: isExpanded ? 'fixed' : 'relative',
          left: isExpanded ? '50%' : 'auto',
          top: isExpanded ? '50%' : 'auto',
          transform: isExpanded ? 'translate(-50%, -50%)' : 'none',
          zIndex: isExpanded ? 1000 : 10,
          margin: isExpanded ? 0 : '0 auto',
          width: isExpanded ? 'min(90vw, 560px)' : '100%',
          maxWidth: isExpanded ? '560px' : '100%',
        }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Левая часть - баланс */}
        <motion.div
          className="balance-info"
          animate={{
            opacity: isExpanded ? 0 : 1,
            width: isExpanded ? 0 : 'auto',
            marginRight: isExpanded ? 0 : '24px',
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="balance-header">
            <span className="balance-label">Personal Funds</span>
          </div>
          <div className="balance-amount">
            <span className="balance-value">
              {balanceData.balance.toLocaleString('en-US')}
            </span>
            <span className="balance-currency">€</span>
          </div>
          <div className="balance-divider" />
          <div className="credit-info">
            <span className="credit-label">Credit Limit</span>
            <span className="credit-value">
              {balanceData.creditLimit.toLocaleString('en-US')} €
            </span>
          </div>
        </motion.div>

        {/* Правая часть - карта */}
        <motion.div
          className="card-wrapper"
          onClick={() => !isExpanded && setIsExpanded(true)}
          animate={{
            position: 'relative',
            right: 'auto',
            top: 'auto',
            transform: 'none',
            width: isExpanded ? '100%' : 'min(360px, 42%)',
            height: isExpanded ? '480px' : '180px',
            margin: 0,
            marginTop: 0,
          }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Красивая карта */}
          <motion.div className="beautiful-card">
            {/* Фон с градиентом */}
            <div className="card-bg">
              <div className="card-gradient" />
              <div className="card-glow glow-1" />
              <div className="card-glow glow-2" />
            </div>

            {/* Контент карты */}
            <div className="card-body">
              {/* Логотип/иконка */}
              <div className="card-icon">💳</div>

              {/* Номер карты */}
              <motion.div
                className="card-number"
                animate={{
                  fontSize: isExpanded ? '28px' : '18px',
                  marginTop: isExpanded ? '40px' : '20px',
                }}
              >
                {cardData.number}
              </motion.div>

              {/* Информация внизу */}
              <motion.div
                className="card-info"
                animate={{
                  marginTop: isExpanded ? '60px' : 'auto',
                }}
              >
                {/* Имя держателя */}
                <motion.div
                  className="card-holder"
                  animate={{
                    opacity: isExpanded ? 1 : 0,
                    display: isExpanded ? 'block' : 'none',
                    marginBottom: isExpanded ? '20px' : 0,
                  }}
                >
                  <span className="info-label">CARDHOLDER</span>
                  <div className="info-value">{cardData.name}</div>
                </motion.div>

                {/* Срок действия и CVV */}
                <div className="card-details">
                  <div className="detail-item">
                    <span className="info-label">VALID THRU</span>
                    <div className="info-value">{cardData.expiry}</div>
                  </div>
                  {isExpanded && (
                    <motion.div
                      className="detail-item"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="info-label">CVV</span>
                      <div className="info-value">{cardData.cvv}</div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Кнопка закрытия */}
            {isExpanded && (
              <motion.button
                className="card-close"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
              >
                ✕
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default InteractiveCard;
