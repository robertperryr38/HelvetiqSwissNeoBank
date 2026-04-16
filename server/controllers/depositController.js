const { readDB, writeDB } = require('../storage');

const createDeposit = (req, res) => {
  const { amount, method, requisites } = req.body;
  const userId = parseInt(req.headers['user-id']);

  // Validate input
  if (!amount || !method) {
    return res.status(400).json({ error: 'Amount and method are required' });
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
    return res.status(400).json({ error: 'User must be approved to make deposits' });
  }

  // Create deposit
  const deposit = {
    id: db.counters.depositId++,
    userId,
    amount,
    method,
    requisites: requisites || null,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.deposits.push(deposit);
  writeDB(db);

  return res.status(201).json(deposit);
};

const getAdminDeposits = (req, res) => {
  const db = readDB();
  return res.json(db.deposits);
};

const getUserDeposits = (req, res) => {
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

  // Get deposits for user
  const userDeposits = db.deposits.filter(d => d.userId === userId);

  return res.json(userDeposits);
};

const processDeposit = (req, res) => {
  const { id } = req.params;
  const { requisites } = req.body;
  const depositId = parseInt(id);

  const db = readDB();

  // Find deposit
  const deposit = db.deposits.find(d => d.id === depositId);
  if (!deposit) {
    return res.status(404).json({ error: 'Deposit not found' });
  }

  // Check if already processed
  if (deposit.status === 'processed') {
    return res.status(400).json({ error: 'Deposit already processed' });
  }

  // Require requisites from admin before processing
  if (!requisites || requisites.trim() === '') {
    return res.status(400).json({ error: 'Requisites are required to process deposit' });
  }

  // Update deposit status and requisites
  deposit.status = 'requisites_provided';
  deposit.requisites = requisites;

  writeDB(db);

  return res.json({ message: 'Requisites provided', deposit });
};

const creditDeposit = (req, res) => {
  const { id } = req.params;
  const depositId = parseInt(id);

  const db = readDB();

  // Find deposit
  const deposit = db.deposits.find(d => d.id === depositId);
  if (!deposit) {
    return res.status(404).json({ error: 'Deposit not found' });
  }

  // Check if requisites are provided
  if (deposit.status !== 'requisites_provided') {
    return res.status(400).json({ error: 'Requisites must be provided first' });
  }

  // Check if already credited
  if (deposit.status === 'processed') {
    return res.status(400).json({ error: 'Deposit already credited' });
  }

  // Update deposit status
  deposit.status = 'processed';

  // Find user and increase balance
  const user = db.users.find(u => u.id === deposit.userId);
  if (user) {
    user.balance += deposit.amount;
    
    // Create transaction
    const transaction = {
      id: db.counters.transactionId++,
      userId: deposit.userId,
      type: 'income',
      amount: deposit.amount,
      description: `Пополнение через ${deposit.method}`,
      category: '💰',
      createdAt: new Date().toISOString(),
    };
    db.transactions.push(transaction);
  }

  writeDB(db);

  return res.json({ message: 'Deposit credited', deposit });
};

module.exports = { createDeposit, getAdminDeposits, processDeposit, getUserDeposits, creditDeposit };
