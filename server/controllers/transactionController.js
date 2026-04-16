const { readDB, writeDB } = require('../storage');

const getUserTransactions = (req, res) => {
  const userId = parseInt(req.headers['user-id']);

  if (!userId) {
    return res.status(400).json({ error: 'User ID required in headers' });
  }

  const db = readDB();

  // Check if user exists
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get transactions for user
  const userTransactions = db.transactions.filter(t => t.userId === userId);

  return res.json(userTransactions);
};

const createTransaction = (req, res) => {
  const { type, amount, description, category } = req.body;
  const userId = parseInt(req.headers['user-id']);

  if (!userId) {
    return res.status(400).json({ error: 'User ID required in headers' });
  }

  const db = readDB();

  // Check if user exists
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Create transaction
  const transaction = {
    id: db.counters.transactionId || (db.counters.transactionId = 1),
    userId,
    type, // 'income' or 'expense'
    amount,
    description,
    category,
    createdAt: new Date().toISOString(),
  };

  db.transactions.push(transaction);
  db.counters.transactionId = (db.counters.transactionId || 1) + 1;
  writeDB(db);

  return res.status(201).json(transaction);
};

module.exports = { getUserTransactions, createTransaction };