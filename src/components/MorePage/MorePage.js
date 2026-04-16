import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationService from '../../services/NotificationService';
import './MorePage.css';
import { apiUrl } from '../../config';

function MorePage({ onLogout, user, onSettings, isChatOpen, onOpenChat, onCloseChat }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(user);
  const messagesEndRef = useRef(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!token || !storedUser) return;

      const response = await fetch(apiUrl('/users/me'), {
        headers: {
          Authorization: `Bearer ${token}`,
          'user-id': storedUser.id.toString(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...storedUser,
            status: data.status,
            balance: data.balance,
            cashback: data.cashback,
          })
        );
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(fetchUserData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    NotificationService.requestPermission();
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isChatOpen]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const currentUser = JSON.parse(localStorage.getItem('user'));

      const response = await fetch(apiUrl('/support/messages'), {
        headers: {
          Authorization: `Bearer ${token}`,
          'user-id': currentUser.id.toString(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newMessages = data.map((msg) => ({
          id: msg.id,
          text: msg.text,
          sender: msg.fromAdmin ? 'support' : 'user',
          timestamp: new Date(msg.createdAt).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));

        setMessages((prevMessages) => {
          const hasNewAdminMessages = newMessages.some(
            (msg) =>
              msg.sender === 'support' &&
              !prevMessages.some((oldMsg) => oldMsg.id === msg.id)
          );

          if (hasNewAdminMessages) {
            NotificationService.notifyNewMessage('Helvetiq Bank Support');
          }

          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() && !loading) {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const currentUser = JSON.parse(localStorage.getItem('user'));

        const response = await fetch(apiUrl('/support/message'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'user-id': currentUser.id.toString(),
          },
          body: JSON.stringify({
            text: inputValue,
          }),
        });

        if (response.ok) {
          const newMessage = await response.json();
          setMessages((prev) => [
            ...prev,
            {
              id: newMessage.id,
              text: newMessage.text,
              sender: 'user',
              timestamp: new Date(newMessage.createdAt).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          ]);
          setInputValue('');
          setTimeout(fetchMessages, 1000);
        } else {
          alert('Failed to send the message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send the message');
      } finally {
        setLoading(false);
      }
    }
  };

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

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -10 },
  };

  const openChat = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onOpenChat();
  };

  const closeChat = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onCloseChat();
  };

  return (
    <motion.div
      className="more-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {!isChatOpen ? (
        <div className="more-page__container">
          <motion.div className="more-page__header" variants={itemVariants}>
            <h1 className="more-page__title">More</h1>
            <p className="more-page__subtitle">Settings & Support</p>
          </motion.div>

          <motion.div
            className="more-section"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="more-section__title">Profile</h2>

            <motion.div className="profile-card" variants={itemVariants}>
              <div className="profile-card__avatar">👤</div>
              <div className="profile-card__info">
                <div className="profile-card__login">
                  {userData?.login || 'user@helvetiq.com'}
                </div>
                <div className="profile-card__status-container">
                  <span className="profile-card__status-label">Status:</span>
                  <motion.span
                    className={`profile-card__status profile-card__status--${
                      userData?.status === 'blocked'
                        ? 'blocked'
                        : userData?.status === 'pending'
                          ? 'pending'
                          : 'approved'
                    }`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    key={userData?.status}
                  >
                    {userData?.status === 'blocked'
                      ? 'Blocked'
                      : userData?.status === 'pending'
                        ? 'Pending Verification'
                        : 'Active'}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="more-section"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="more-section__title">Support</h2>

            <motion.button
              type="button"
              className="support-btn"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openChat}
            >
              <span className="support-btn__icon">💬</span>
              <span className="support-btn__text">Contact Support</span>
              <span className="support-btn__arrow">→</span>
            </motion.button>
          </motion.div>

          <motion.div
            className="more-section"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="more-section__title">More</h2>

            <motion.button
              type="button"
              className="settings-btn"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSettings}
            >
              <span className="settings-btn__icon">⚙️</span>
              <span className="settings-btn__text">Settings</span>
              <span className="settings-btn__arrow">→</span>
            </motion.button>

            <motion.button
              type="button"
              className="settings-btn"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="settings-btn__icon">📋</span>
              <span className="settings-btn__text">Terms & Conditions</span>
              <span className="settings-btn__arrow">→</span>
            </motion.button>

            <motion.button
              type="button"
              className="settings-btn settings-btn--logout"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogout}
            >
              <span className="settings-btn__icon">🚪</span>
              <span className="settings-btn__text">Logout</span>
              <span className="settings-btn__arrow">→</span>
            </motion.button>
          </motion.div>
        </div>
      ) : (
        <motion.div
          className="chat-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="chat-header">
            <motion.button
              type="button"
              className="chat-header__back"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={closeChat}
            >
              ←
            </motion.button>
            <div className="chat-header__info">
              <h3 className="chat-header__title">Support</h3>
              <p className="chat-header__status">Online</p>
            </div>
            <div className="chat-header__placeholder" />
          </div>

          <div className="chat-messages">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`chat-message chat-message--${message.sender}`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="chat-message__bubble">
                    <p className="chat-message__text">{message.text}</p>
                    <span className="chat-message__time">{message.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <input
                type="text"
                className="chat-input"
                placeholder="Write a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <motion.button
                type="button"
                className="chat-input__send"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
              >
                ✈️
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default MorePage;
