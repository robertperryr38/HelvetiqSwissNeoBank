const { readDB, writeDB } = require('../storage');

const sendMessage = (req, res) => {
  const { text, fromAdmin, userId: bodyUserId } = req.body;
  const senderId = parseInt(req.headers['user-id']);

  // Validate input
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const db = readDB();

  if (fromAdmin) {
    const toUserId = parseInt(bodyUserId);
    if (!toUserId) {
      return res.status(400).json({ error: 'Target userId is required for admin messages' });
    }

    const user = db.users.find(u => u.id === toUserId);
    if (!user) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    const message = {
      id: db.counters.messageId++,
      userId: senderId || 0,
      toUserId,
      text,
      fromAdmin: true,
      createdAt: new Date().toISOString(),
    };

    db.messages.push(message);
    writeDB(db);

    return res.status(201).json(message);
  }

  if (!senderId) {
    return res.status(400).json({ error: 'User ID required in headers' });
  }

  const user = db.users.find(u => u.id === senderId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const message = {
    id: db.counters.messageId++,
    userId: senderId,
    text,
    fromAdmin: false,
    createdAt: new Date().toISOString(),
  };

  db.messages.push(message);
  writeDB(db);

  return res.status(201).json(message);
};

const getMessages = (req, res) => {
  const userId = parseInt(req.headers['user-id']);
  const queryUserId = parseInt(req.query.userId);

  const db = readDB();

  if (userId) {
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userMessages = db.messages.filter(
      m => (!m.fromAdmin && m.userId === userId) || (m.fromAdmin && m.toUserId === userId)
    );
    return res.json(userMessages);
  }

  if (queryUserId) {
    const user = db.users.find(u => u.id === queryUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userMessages = db.messages.filter(
      m => (!m.fromAdmin && m.userId === queryUserId) || (m.fromAdmin && m.toUserId === queryUserId)
    );
    return res.json(userMessages);
  }

  return res.json(db.messages);
};

module.exports = { sendMessage, getMessages };
