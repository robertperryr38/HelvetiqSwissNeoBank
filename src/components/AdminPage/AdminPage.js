import React, { useState, useEffect, useCallback, useRef } from 'react';
import NotificationService from '../../services/NotificationService';
import './AdminPage.css';
import { apiUrl } from '../../config';

function AdminPage() {
  const [activeSection, setActiveSection] = useState('kyc');
  const [data, setData] = useState([]);
  const [requisites, setRequisites] = useState({});
  const [balances, setBalances] = useState({});
  const [messageText, setMessageText] = useState('');
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const activeSectionRef = useRef('kyc');
  const selectedChatUserRef = useRef(null);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    selectedChatUserRef.current = selectedChatUser;
  }, [selectedChatUser]);

  const fetchChatUsers = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError('');
      const response = await fetch(apiUrl('/users'));
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      setChatUsers(result);

      setSelectedChatUser((prev) => {
        if (prev && result.some((u) => u.id === prev)) {
          return prev;
        }
        return result.length > 0 ? result[0].id : null;
      });
    } catch (fetchError) {
      setError(`Failed to load users for chat: ${fetchError.message}`);
      console.error('Error fetching chat users:', fetchError);
      setChatUsers([]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  const fetchData = useCallback(async (section, { silent = false } = {}) => {
    let url = apiUrl('/');
    switch (section) {
      case 'kyc':
        url += 'admin/kyc';
        break;
      case 'deposits':
        url += 'admin/deposits';
        break;
      case 'transfers':
        url += 'admin/transfers';
        break;
      case 'users':
        url += 'users';
        break;
      case 'chat':
        url += 'admin/support/messages';
        break;
      default:
        return;
    }

    try {
      if (!silent) {
        setLoading(true);
      }
      setError('');
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (fetchError) {
      setError(`Failed to load ${section}: ${fetchError.message}`);
      console.error('Error fetching data:', fetchError);
      setData([]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  const fetchChatMessages = useCallback(async (userId, { silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError('');
      const response = await fetch(apiUrl(`/admin/support/messages?userId=${userId}`));
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (fetchError) {
      setError(`Failed to load chat: ${fetchError.message}`);
      console.error('Error fetching chat messages:', fetchError);
      setData([]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (activeSection === 'chat') {
      fetchChatUsers();
    } else {
      fetchData(activeSection);
    }
  }, [activeSection, fetchChatUsers, fetchData]);

  useEffect(() => {
    if (activeSection === 'chat' && selectedChatUser) {
      fetchChatMessages(selectedChatUser);
    }
  }, [activeSection, selectedChatUser, fetchChatMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentSection = activeSectionRef.current;
      const currentChatUser = selectedChatUserRef.current;

      if (currentSection === 'chat') {
        fetchChatUsers({ silent: true });
        if (currentChatUser) {
          fetchChatMessages(currentChatUser, { silent: true });
        }
      } else {
        fetchData(currentSection, { silent: true });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchChatUsers, fetchChatMessages, fetchData]);

  const handleApprove = async (id) => {
    try {
      setError('');
      const response = await fetch(apiUrl(`/admin/kyc/${id}/approve`), {
        method: 'POST',
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      await fetchData('kyc', { silent: true });
    } catch (approveError) {
      setError(`Failed to approve KYC: ${approveError.message}`);
      console.error('Error:', approveError);
    }
  };

  const handleReject = async (id) => {
    try {
      setError('');
      const response = await fetch(apiUrl(`/admin/kyc/${id}/reject`), {
        method: 'POST',
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      await fetchData('kyc', { silent: true });
    } catch (rejectError) {
      setError(`Failed to reject KYC: ${rejectError.message}`);
      console.error('Error:', rejectError);
    }
  };

  const handleProcessDeposit = async (id) => {
    try {
      setError('');
      const req = requisites[id];
      const response = await fetch(apiUrl(`/admin/deposit/${id}/process`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requisites: req }),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      setRequisites((prev) => ({ ...prev, [id]: '' }));
      await fetchData('deposits', { silent: true });
    } catch (processError) {
      setError(`Failed to process deposit: ${processError.message}`);
      console.error('Error:', processError);
    }
  };

  const handleCreditDeposit = async (id) => {
    try {
      setError('');
      const response = await fetch(apiUrl(`/admin/deposit/${id}/credit`), {
        method: 'POST',
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      await fetchData('deposits', { silent: true });
    } catch (creditError) {
      setError(`Failed to credit deposit: ${creditError.message}`);
      console.error('Error:', creditError);
    }
  };

  const handleProcessTransfer = async (id) => {
    try {
      setError('');
      const response = await fetch(apiUrl(`/admin/transfer/${id}/process`), {
        method: 'POST',
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      await fetchData('transfers', { silent: true });
    } catch (transferError) {
      setError(`Failed to process transfer: ${transferError.message}`);
      console.error('Error:', transferError);
    }
  };

  const handleApproveUser = async (id) => {
    try {
      setError('');
      const response = await fetch(apiUrl(`/admin/user/${id}/approve`), {
        method: 'POST',
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      NotificationService.notifyUserApproved();
      await fetchData('users', { silent: true });
    } catch (approveError) {
      setError(`Failed to approve user: ${approveError.message}`);
      console.error('Error:', approveError);
    }
  };

  const handleUpdateBalance = async (id) => {
    try {
      setError('');
      const newBalance = balances[id];
      if (!newBalance) {
        setError('Please enter a balance');
        return;
      }
      const response = await fetch(apiUrl(`/admin/user/${id}/balance`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: newBalance }),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      setBalances((prev) => ({ ...prev, [id]: '' }));
      await fetchData('users', { silent: true });
    } catch (balanceError) {
      setError(`Failed to update balance: ${balanceError.message}`);
      console.error('Error:', balanceError);
    }
  };

  const handleBlockUser = async (id) => {
    try {
      setError('');
      const response = await fetch(apiUrl(`/admin/user/${id}/block`), {
        method: 'POST',
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      NotificationService.notifyUserBlocked();
      await fetchData('users', { silent: true });
    } catch (blockError) {
      setError(`Failed to block user: ${blockError.message}`);
      console.error('Error:', blockError);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      setError('Please enter a message');
      return;
    }
    if (!selectedChatUser) {
      setError('Выберите пользователя для переписки');
      return;
    }
    try {
      setError('');
      const response = await fetch(apiUrl('/admin/support/message'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: messageText,
          fromAdmin: true,
          userId: selectedChatUser,
        }),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      NotificationService.notifyNewMessage('Поддержка Helvetiq Bank');
      setMessageText('');
      await fetchChatMessages(selectedChatUser, { silent: true });
    } catch (sendError) {
      setError(`Failed to send message: ${sendError.message}`);
      console.error('Error:', sendError);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div style={{ padding: '20px' }}>Загрузка...</div>;
    }

    if (error) {
      return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
    }

    switch (activeSection) {
      case 'kyc':
        return (
          <div>
            <h2>KYC Requests</h2>
            <ul>
              {data.map((item) => (
                <li key={item.id}>
                  User ID: {item.userId}, Passport Front: {item.passportFront}, Passport Back: {item.passportBack}, Status: {item.status}
                  <button onClick={() => handleApprove(item.id)}>Approve</button>
                  <button onClick={() => handleReject(item.id)}>Reject</button>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'deposits':
        return (
          <div>
            <h2>Deposits</h2>
            <ul>
              {data.map((item) => (
                <li key={item.id}>
                  User ID: {item.userId}, Amount: {item.amount}, Method: {item.method}, Status: {item.status}
                  {item.status === 'pending' && (
                    <div>
                      <input
                        type="text"
                        placeholder="Реквизиты"
                        value={requisites[item.id] || ''}
                        onChange={(e) =>
                          setRequisites((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                      />
                      <button onClick={() => handleProcessDeposit(item.id)}>Обработать</button>
                    </div>
                  )}
                  {item.status === 'requisites_provided' && (
                    <div>
                      <p>Реквизиты: {item.requisites}</p>
                      <button onClick={() => handleCreditDeposit(item.id)}>
                        Зачислить средства
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'transfers':
        return (
          <div>
            <h2>Transfers</h2>
            <ul>
              {data.map((item) => (
                <li key={item.id}>
                  User ID: {item.userId}, Card Number: {item.cardNumber}, Amount: {item.amount}, Status: {item.status}
                  {item.status === 'pending' && (
                    <button onClick={() => handleProcessTransfer(item.id)}>Обработать</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'users':
        return (
          <div>
            <h2>Users</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {data.map((item) => (
                <li
                  key={item.id}
                  style={{
                    marginBottom: '16px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    borderLeft: '3px solid #667eea',
                  }}
                >
                  <div style={{ color: '#fff', marginBottom: '8px' }}>
                    <strong>ID: {item.id}</strong> | Login: {item.login} | Status:{' '}
                    <span
                      style={{
                        color:
                          item.status === 'pending'
                            ? '#ff9500'
                            : item.status === 'approved'
                              ? '#4caf50'
                              : '#999',
                      }}
                    >
                      {item.status}
                    </span>{' '}
                    | Balance: {item.balance} €
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                      type="number"
                      placeholder="Новый баланс"
                      value={balances[item.id] || ''}
                      onChange={(e) =>
                        setBalances((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                      style={{
                        padding: '6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#fff',
                        flex: 1,
                      }}
                    />
                    <button
                      onClick={() => handleUpdateBalance(item.id)}
                      style={{
                        background: '#667eea',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Изменить баланс
                    </button>
                    {item.status === 'pending' && (
                      <button
                        onClick={() => handleApproveUser(item.id)}
                        style={{
                          background: '#4caf50',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        ✓ Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleBlockUser(item.id)}
                      style={{
                        background: '#ff5252',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Заблокировать
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'chat':
        return (
          <div>
            <h2>Chat Messages</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
                Выберите пользователя для чата:
              </label>
              <select
                value={selectedChatUser || ''}
                onChange={(e) => setSelectedChatUser(parseInt(e.target.value, 10))}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                }}
              >
                <option value="" disabled style={{ color: '#000' }}>
                  Выберите пользователя
                </option>
                {chatUsers.map((user) => (
                  <option key={user.id} value={user.id} style={{ color: '#000' }}>
                    {user.login} ({user.status})
                  </option>
                ))}
              </select>
            </div>
            <div
              style={{
                maxHeight: '320px',
                overflowY: 'auto',
                marginBottom: '16px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                background: 'rgba(20, 20, 40, 0.8)',
                color: '#fff',
              }}
            >
              {data.length === 0 ? (
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Нет сообщений для выбранного пользователя.
                </p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {data.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        marginBottom: '12px',
                        padding: '8px',
                        background: item.fromAdmin
                          ? 'rgba(102, 126, 234, 0.2)'
                          : 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        borderLeft: `3px solid ${item.fromAdmin ? '#667eea' : '#888'}`,
                      }}
                    >
                      <strong style={{ color: item.fromAdmin ? '#667eea' : '#aaa' }}>
                        {item.fromAdmin ? '👤 ADMIN' : `📱 User ${item.userId}`}:
                      </strong>
                      <span style={{ color: '#fff', marginLeft: '8px' }}>{item.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              type="text"
              placeholder="Введите сообщение"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                marginBottom: '12px',
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              style={{
                background: '#667eea',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Отправить
            </button>
          </div>
        );
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <h1>Admin Panel</h1>
        <ul>
          <li onClick={() => setActiveSection('kyc')}>KYC</li>
          <li onClick={() => setActiveSection('deposits')}>Пополнения</li>
          <li onClick={() => setActiveSection('transfers')}>Переводы</li>
          <li onClick={() => setActiveSection('users')}>Пользователи</li>
          <li onClick={() => setActiveSection('chat')}>Чат</li>
        </ul>
      </div>
      <div className="content">
        {error && <div className="error-message">{error}</div>}
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPage;
