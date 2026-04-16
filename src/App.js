import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import InteractiveCard from './components/InteractiveCard/InteractiveCard';
import ActionButtons from './components/ActionButtons/ActionButtons';
import TransactionsList from './components/TransactionsList/TransactionsList';
import BottomNavigation from './components/BottomNavigation/BottomNavigation';
import Modal from './components/Modal/Modal';
import TransferModal from './components/TransferModal/TransferModal';
import OtherPayments from './components/OtherPayments/OtherPayments';
import DepositPage from './components/DepositPage/DepositPage';
import CreditPage from './components/CreditPage/CreditPage';
import CashbackPage from './components/CashbackPage/CashbackPage';
import MorePage from './components/MorePage/MorePage';
import AdminPage from './components/AdminPage/AdminPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import PendingDepositPage from './components/PendingDepositPage/PendingDepositPage';
import Settings from './components/Settings/Settings';
import { apiUrl } from './config';

function App() {
  const ADMIN_SECRET_ROUTE = '/ByhFt{GYcPX';
  const ADMIN_SECRET_HASH = '#/ByhFt{GYcPX?';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isOtherPaymentsOpen, setIsOtherPaymentsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState('login');
  const [user, setUser] = useState(null);
  const [kycStatus, setKycStatus] = useState('loading');

  const isAdminPath = () => {
    return (
      window.location.pathname === ADMIN_SECRET_ROUTE ||
      window.location.hash.includes(ADMIN_SECRET_HASH)
    );
  };

  const checkKycStatus = useCallback(async (userId, token) => {
    try {
      const response = await fetch(apiUrl('/users/me'), {
        headers: {
          'user-id': userId.toString(),
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const nextStatus = userData.status || 'pending';
        setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : userData));
        setKycStatus(nextStatus);

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...parsedUser,
              ...userData,
              status: nextStatus,
            })
          );
        }
      } else {
        setKycStatus('pending');
      }
    } catch (error) {
      console.error('Error checking KYC status:', error);
      setKycStatus('pending');
    }
  }, []);

  useEffect(() => {
    if (isAdminPath()) {
      return;
    }

    const storedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');
    if (storedUser && authToken) {
      const parsedUser = JSON.parse(storedUser);
      const initialStatus = parsedUser.status || 'pending';
      setUser(parsedUser);
      setIsAuthenticated(true);
      setKycStatus(initialStatus);
      checkKycStatus(parsedUser.id, authToken);
    }
  }, [checkKycStatus]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      checkKycStatus(user.id, token);
    }
  }, [isAuthenticated, user, checkKycStatus]);

  useEffect(() => {
    if (!isAuthenticated || !user || kycStatus !== 'pending') {
      return;
    }

    const interval = setInterval(() => {
      checkKycStatus(user.id, localStorage.getItem('authToken'));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, kycStatus, checkKycStatus]);

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  if (isAdminPath()) {
    return <AdminPage />;
  }

  if (!isAuthenticated) {
    return (
      <>
        {authPage === 'login' ? (
          <LoginPage
            onLoginSuccess={() => {
              const storedUser = localStorage.getItem('user');
              if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setKycStatus(parsedUser.status || 'pending');
                setIsAuthenticated(true);
              }
            }}
            onSwitchToRegister={() => setAuthPage('register')}
          />
        ) : (
          <RegisterPage
            onRegisterSuccess={() => {
              const storedUser = localStorage.getItem('user');
              if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setKycStatus(parsedUser.status || 'pending');
                setIsAuthenticated(true);
              }
            }}
            onSwitchToLogin={() => setAuthPage('login')}
          />
        )}
      </>
    );
  }

  if (isAuthenticated && kycStatus === 'pending') {
    return (
      <motion.div
        className="app-container"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="screen"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: '48px' }}
          >
            ⏳
          </motion.div>
          <h2 style={{ textAlign: 'center', color: 'white', margin: 0 }}>
            Passport Verification
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
              margin: 0,
            }}
          >
            Your passport is currently under review.
            <br />
            Please wait for administrator approval.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('authToken');
              setIsAuthenticated(false);
              setUser(null);
              setAuthPage('login');
              setKycStatus('loading');
            }}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </motion.div>
    );
  }

  if (isAuthenticated && kycStatus === 'loading') {
    return (
      <motion.div
        className="app-container"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="screen"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: '48px' }}
          >
            ⏳
          </motion.div>
          <h2 style={{ textAlign: 'center', color: 'white', margin: 0 }}>
            Loading...
          </h2>
        </div>
      </motion.div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    setAuthPage('login');
    setCurrentPage('home');
    setKycStatus('loading');
  };

  return (
    <motion.div
      className="app-container"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="screen">
        {currentPage === 'home' && (
          <>
            <InteractiveCard />
            <ActionButtons
              onPopovnit={() => setIsModalOpen(true)}
              onTransfer={() => setIsTransferModalOpen(true)}
              onOtherPayments={() => setIsOtherPaymentsOpen(true)}
              onPendingDeposit={() => setCurrentPage('pending-deposit')}
            />
            <TransactionsList />
          </>
        )}
        {currentPage === 'credit' && <CreditPage />}
        {currentPage === 'deposit' && <DepositPage />}
        {currentPage === 'cashback' && <CashbackPage />}
        {currentPage === 'more' && (
          <MorePage
            onLogout={handleLogout}
            user={user}
            onSettings={() => setCurrentPage('settings')}
          />
        )}
        {currentPage === 'settings' && (
          <Settings onBack={() => setCurrentPage('more')} />
        )}
        {currentPage === 'pending-deposit' && (
          <PendingDepositPage onBack={() => setCurrentPage('home')} />
        )}
      </div>
      <BottomNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setCurrentPage('pending-deposit')}
      />
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />
      <OtherPayments
        isOpen={isOtherPaymentsOpen}
        onClose={() => setIsOtherPaymentsOpen(false)}
      />
    </motion.div>
  );
}

export default App;
