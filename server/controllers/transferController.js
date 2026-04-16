const { readDB, writeDB } = require('../storage');

const createTransfer = (req, res) => {
  const { cardNumber, amount } = req.body;
  const userId = parseInt(req.headers['user-id']);

  // Validate input
  if (!cardNumber || !amount) {
    return res.status(400).json({ error: 'Card number and amount are required' });
  }

  if (!userId) {
    return res.status(400).json({ error: 'User ID required in headers' });
  }

  const db = readDB();

  // Check if user exists
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if user is approved
  if (user.status !== 'approved') {
    return res.status(400).json({ error: 'User must be approved to make transfers' });
  }

  // Create transfer request
  const transfer = {
    id: db.counters.transferId++,
    userId,
    cardNumber,
    amount,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.transfers.push(transfer);
  writeDB(db);

  return res.status(201).json(transfer);
};

const getAdminTransfers = (req, res) => {
  const db = readDB();
  return res.json(db.transfers);
};

const processTransfer = (req, res) => {
  const { id } = req.params;
  const transferId = parseInt(id);

  const db = readDB();

  // Find transfer
  const transfer = db.transfers.find(t => t.id === transferId);
  if (!transfer) {
    return res.status(404).json({ error: 'Transfer not found' });
  }

  // Check if already processed
  if (transfer.status === 'processed') {
    return res.status(400).json({ error: 'Transfer already processed' });
  }

  // Find user and decrease balance
  const user = db.users.find(u => u.id === transfer.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.balance < transfer.amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  // Update transfer status
  transfer.status = 'processed';
  user.balance -= transfer.amount;

  // Create transaction
  const transaction = {
    id: db.counters.transactionId++,
    userId: transfer.userId,
    type: 'expense',
    amount: transfer.amount,
    description: `Перевод на карту ${transfer.cardNumber}`,
    category: '💳',
    createdAt: new Date().toISOString(),
  };
  db.transactions.push(transaction);

  writeDB(db);

  return res.json({ message: 'Transfer processed', transfer });
};

module.exports = { createTransfer, getAdminTransfers, processTransfer };
